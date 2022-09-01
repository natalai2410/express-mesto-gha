// импортируем модель
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при создании карточки');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные при создании карточки');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.code === 404) {
        res.status(err.code)
          .send('Карточка с указанным _id не найдена');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => res.status(200)
    .send(card))
    .catch((err) => {
      if (err.code === 404) {
        res.status(err.code)
          .send('Карточка с указанным _id не найдена');
      } else if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные для постановки лайка');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.code === 404) {
        res.status(err.code)
          .send('Карточка с указанным _id не найдена');
      } else if (err.code === 400) {
        res.status(err.code)
          .send('Переданы некорректные данные для снятия лайка');
      } else if (err.code === 500) {
        res.status(err.code)
          .send('Произошла ошибка');
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
