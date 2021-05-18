'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'UserId' })
      User.hasMany(models.Favorite, { foreignKey: 'UserId' })
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Email tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'Email tidak boleh kosong!'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Username tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'Username tidak boleh kosong!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password tidak boleh kosong!'
        },
        notEmpty: {
          msg: 'Password tidak boleh kosong!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(user => {
    user.password = hash(user.password);
  })
  return User;
};