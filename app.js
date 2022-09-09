const express = require('express');
const auth = require('./middlewares/auth');

const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');

const { createUser, login } = require('./controllers/users');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// eslint-disable-next-line import/order
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const NotFoundError = require('./errors/notFoundError');

const app = express();

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.use(express.json());

  app.post('/signin', validationLogin, login);
  app.post('/signup', validationCreateUser, createUser);

  app.use(auth); // все роуты ниже этой строки будут защищены

  app.use(userRoutes);
  app.use(cardRoutes);

  app.use((req, res, next) => {
    next(NotFoundError('Карточка с указанным _id не найдена'));
    // res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
  });

  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

main();
