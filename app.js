const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// Подключаем роутер user в файле app.js. Он должен срабатывать при запросе на адрес '/users'
// app.use('/users', require('./routes/users'));

const userRoutes = require('./routes/users');

app.use('/users', userRoutes);
app.use(bodyParser.json());

// мидлвэр
app.use((req, res, next) => {
  req.user = {
    _id: '6310a76f76e68763193db148',
  };
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
