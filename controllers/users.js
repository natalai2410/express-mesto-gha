// импортируем модель
const User = require('../models/user');

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200)
      .send({ data: user }))
    .catch((err) => {
      if (err.code === 404) {
        res.status(err.code)
          .send('Запрашиваемый пользователь не найден');
      } if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// POST /users — создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// PATCH /users/me — обновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res
      .send({ data: user }))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при обновлении профиля');
      } else if (err.code === 404) {
        res.status(err.code)
          .send('Запрашиваемый пользователь не найден');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res
      .send({ data: user }))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при обновлении аватара');
      } else if (err.code === 404) {
        res.status(err.code)
          .send('Запрашиваемый пользователь не найден');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
