const { User, Post, Favorite } = require('../models');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: './public/images/',
  filename: function(req, file, cb) {
    const postId = req.app.locals.postId;
    delete req.app.locals.id;
    cb(null, file.fieldname + '-' + postId + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
}).single('image');

class Controller {
  static findAll(req, res) {
    if (req.session.login) {
      if (req.query.username) {
        let user;
        User.findOne({
            where: {
              username: req.query.username
            },
            include: {
              model: Post,
              order: [
                ['id', 'desc']
              ]
            }
          })
          .then(data => {
            user = data;
            return User.findByPk(req.session.UserId, { include: [Favorite] })
          })
          .then(fav => {
            res.render('profile', { data: user, id: req.session.UserId, user: req.query.username, favorites: fav.Favorites })
          })
          .catch(err => res.render('error', { id: req.session.UserId, err }));
      } else {
        Post.findAll({
            include: [User, Favorite],
            order: [
              ['id', 'desc']
            ]
          })
          .then(data => {
            const img = req.query.img || null;
            req.app.locals.postId = data[0].id + 1;
            res.render('posts', { data: data || null, id: req.session.UserId, img })
          })
          .catch(err => res.render('error', { id: req.session.UserId, err }));
      }
    } else {
      res.redirect('/users/login');
    }
  }

  static getAdd(req, res) {
    res.render('post-form', { user: {}, id: req.session.UserId });
  }

  static postAdd(req, res) {
    upload(req, res, (err) => {
      if (err) {
        res.render('error', { id: req.session.UserId, err });
      } else {
        Post.create({
            title: req.body.title,
            description: req.body.description,
            img_url: `/images/${req.file.filename}`,
            UserId: req.session.UserId
          })
          .then((data) => res.redirect('/posts?img=' + data.img_url))
          .catch(err => res.render('error', { id: req.session.UserId, err }));
      }
    });

  }

  static getEdit(req, res) {
    Post.findOne({ where: req.params })
      .then(user => {
        res.render('post-form', { user, id: req.session.UserId });
      })
      .catch(err => res.render('error', { id: req.session.UserId, err }));
  }

  static postEdit(req, res) {
    Post.update(req.body, { where: req.params })
      .then(() => {
        if (req.query.loc == "profile") {
          res.redirect('/users/' + req.session.UserId)
        } else {
          res.redirect('/posts')
        }
      })
      .catch(err => res.render('error', { id: req.session.UserId, err }));
  }

  static delete(req, res) {
    let deleted;
    Post.findByPk(req.params.id)
      .then(data => {
        deleted = data;
        return Post.destroy({ where: req.params })
      })
      .then(async () => {
        await fs.unlink(`./public${deleted.img_url}`, () => {});
        if (req.query.loc == "profile") {
          res.redirect('/users/' + req.session.UserId)
        } else {
          res.redirect('/posts')
        }
      })
      .catch(err => res.render('error', { id: req.session.UserId, err }));
  }

  static fav(req, res) {
    Favorite.create({
        UserId: req.session.UserId,
        PostId: req.params.id
      })
      .then(() => {
        if (req.query.loc == "profile") {
          res.redirect('/users/' + req.session.UserId)
        } else if (req.query.profile) {
          res.redirect('/posts?username=' + req.query.profile)
        } else {
          res.redirect('/posts')
        }
      })
      .catch(err => res.render('error', { id: req.session.UserId, err }));
  }
}

module.exports = Controller;