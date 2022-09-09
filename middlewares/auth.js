const jwt = require('jsonwebtoken');
const { LOGIN_ERR } = require('../errors/errors');

const handleAuthError = (res) => {
  res
    .status(LOGIN_ERR)
    .send({ message: 'Необходима авторизация' });
};

//  извлечём токен, в переменную token запишется только JWT
const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(LOGIN_ERR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = extractBearerToken(authorization);

  // верифицируем токен
  let payload;

  // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку.
  //  Если же с токеном что-то не так, вернётся ошибка.

  try {
    payload = jwt.verify(token, 'yandex-praktikum');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
