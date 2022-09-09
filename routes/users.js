const userRoutes = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/validations');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/:userId', validationUserId, getUser);

userRoutes.patch('/users/me', validationUpdateUser, updateUser);
userRoutes.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

userRoutes.get('/users/me', getCurrentUser);

module.exports = userRoutes;
