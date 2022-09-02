// импортируем модель
const User = require('../models/user');

const {
  VALIDATION_ERROR, NOT_FOUND_ERROR, CAST_ERROR, REQUEST_OK, CREATE_OK,
} = require('../errors/errors');

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(REQUEST_OK)
      .send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(REQUEST_OK).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch(() => res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные пользователя' }));
};
  // User.findById(req.params.id)
  //   .then((user) => res.status(REQUEST_OK).send(user))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
// eslint-disable-next-line max-len
  //       return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
  //     }
// eslint-disable-next-line max-len
  //     if (err.message === 'NotFound') { return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' }); }
  //     return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
  //   });
// };

// POST /users — создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// PATCH /users/me — обновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.status(CREATE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'NotFound') { res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// PATCH /users/me/avatar — обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя ' });
      }
      if (err.name === 'NotFound') { res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый  пользователь не найден' }); }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
