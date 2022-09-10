const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // импортируем bcrypt

const isEmail = require('validator/lib/isEmail');

// создаем схему и модель для пользователя:
const userSchema = new mongoose.Schema(
  {
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String,
      // required: true,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      // required: true,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь океана',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    }).catch((err) => { console.log(err.code); });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
