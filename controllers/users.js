// импортируем модель
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const { REQUEST_OK } = require('../errors/errors');

// цекнтрализованная  обработка  ошибок
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');
const ServerError = require('../errors/serverError');

// GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ServerError('Произошла ошибка')));
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => next(err));
};

// PATCH /users/me — обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  // console.log(`обновление  профиля ${req.body}`);
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

// PATCH /users/me/avatar — обновляет аватар
const updateAvatar = (req, res, next) => {
  const { _id } = req.user;

  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

// // POST /users — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then(() => res.send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // ищем пользователя в  БД
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Методу sign мы передали два аргумента: пейлоуд токена и секретный ключ подписи:
      const token = jwt.sign({ _id: user._id }, 'super-secret_key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  console.log(req.user);
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
