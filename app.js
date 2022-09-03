const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { NOT_FOUND_ERROR } = require('./errors/errors');

const app = express();

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  // мидлвэр
  app.use((req, res, next) => {
    req.user = {
      _id: '631397f2319c4c2e38ca4610',
    };
    next();
  });

  app.use(express.json());

  app.use(userRoutes);
  app.use(cardRoutes);

  app.use((req, res) => {
    res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
  });

  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

// Подключаем роутер user в файле app.js. Он должен срабатывать при запросе на адрес '/users'
// app.use('/users', require('./routes/users'));

main();
