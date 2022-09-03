const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

// const { NOT_FOUND_ERROR } = require('./errors/errors');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
// });

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
};

// Подключаем роутер user в файле app.js. Он должен срабатывать при запросе на адрес '/users'
// app.use('/users', require('./routes/users'));

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

app.use(userRoutes);
app.use(cardRoutes);

app.use(bodyParser.json());

// app.use((req, res) => {
//   res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
// });

// мидлвэр
app.use((req, res, next) => {
  req.user = {
    _id: '6313350b656628b3e5aedce8',
  };
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

main();
