const mongoose = require('mongoose');

// создаем схему и модель для карточки:
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // likes: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: [], // по умолчанию — пустой массив (поле default);
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now, // значение по умолчанию Date.now.
  // },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
