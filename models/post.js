'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'UserId' })
      Post.hasMany(models.Favorite, { foreignKey: 'PostId' })
    }
  };
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'title tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'title tidak boleh kosong!'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'description tidak boleh kosong!'
        }
      }
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'img_url tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'img_url tidak boleh kosong!'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'UserId tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'UserId tidak boleh kosong!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};