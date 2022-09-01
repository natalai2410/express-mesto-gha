// импортируем модель
const Card = require('../models/card');

const { VALIDATION_ERROR, NOT_FOUND_ERROR, CAST_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
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
      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => res.status(200)
    .send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
