// импортируем модель
const Card = require('../models/card');

const { VALIDATION_ERROR, NOT_FOUND_ERROR, CAST_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send('Переданы некорректные данные карточки');
      }
      if (err.name === 'CastError') { res.status(CAST_ERROR).send('Произошла ошибка'); }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send('Переданы некорректные данные при создании карточки');
      }
      if (err.name === 'CastError') { res.status(CAST_ERROR).send('Произошла ошибка'); }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR)
          .send('Карточка с указанным _id не найдена');
      }
      if (err.name === 'CastError') { res.status(CAST_ERROR).send('Произошла ошибка'); }
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
        res.status(NOT_FOUND_ERROR)
          .send('Карточка с указанным _id не найдена');
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR)
          .send('Переданы некорректные данные для постановки лайка');
      }
      if (err.name === 'CastError') {
        res.status(CAST_ERROR)
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
  ).then((card) => res.status(200)
    .send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND_ERROR)
          .send('Карточка с указанным _id не найдена');
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR)
          .send('Переданы некорректные данные для снятия лайка');
      }
      if (err.name === 'CastError') { res.status(CAST_ERROR).send('Произошла ошибка'); }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
