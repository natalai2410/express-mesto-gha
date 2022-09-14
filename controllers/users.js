// импортируем модель
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const {
  CAST_ERROR, REQUEST_OK,
} = require('../errors/errors');

// цекнтрализованная  обработка  ошибок
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
// const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');

// GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(REQUEST_OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные пользователя'));
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if ((err.kind === 'ObjectId') || err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные пользователя'));
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
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
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
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
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// POST /users — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(req.body.password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  })
    .then((user) => {
      res.send({
        //  name, about, avatar, email,
        data: user,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
    }));
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
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(REQUEST_OK).send(user);
  })
    .catch((err) => {
      if ((err.kind === 'ObjectId') || err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные пользователя'));
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
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
