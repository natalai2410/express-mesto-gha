// импортируем модель
const Card = require('../models/card');

const {
  VALIDATION_ERROR, NOT_FOUND_ERROR, CAST_ERROR, REQUEST_OK, CREATE_OK,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(REQUEST_OK)
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
  // const owner = req.user._id;

  Card.create({ name, link })
    .then(() => res.status(CREATE_OK).send())
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });

  // const card = new Card({ name, link });
  //
  // card.save().then(() => {
  //   res.send(card);
  // }).catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
  //   }
  //   return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
  // });
};

// Card.create({ name, link, owner })
//   .then((card) => res.status(CREATE_OK).send(card))
//   .catch((err) => {
//     if (err.name === 'ValidationError') {
// eslint-disable-next-line max-len
//       return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
//     }
//     return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
//   });

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndDelete(id).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные удаляемой карточки' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    { id },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'ереданы некорректные данные для постановки лайка' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с  карточки
const dislikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    { id },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'ереданы некорректные данные для снятия лайка' });
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
