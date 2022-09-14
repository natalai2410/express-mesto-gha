const jwt = require('jsonwebtoken');
// const { LOGIN_ERR } = require('../errors/errors');
const AuthError = require('../errors/authError');

// const handleAuthError = (res) => {
//   res
//     .status(LOGIN_ERR)
//     .send({ message: 'Необходима авторизация' });
// };
//
// //  извлечём токен, в переменную token запишется только JWT
// // const extractBearerToken = (header) => header.replace('Bearer ', '');
//
// // eslint-disable-next-line consistent-return
// module.exports = (req, res, next) => {
//   // достаём авторизационный заголовок
//   const { authorization } = req.headers;
//
//   // убеждаемся, что он есть или начинается с Bearer
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return res
//       .status(LOGIN_ERR)
//       .send({ message: 'Необходима авторизация' });
//   }
//
//   // извлечём токен
//   // const token = extractBearerToken(authorization);
//   const token = authorization.replace('Bearer ', '');
//
//   // верифицируем токен
//   let payload;
//
//   // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку.
//   //  Если же с токеном что-то не так, вернётся ошибка.
//
//   try {
//     // попытаемся верифицировать токен
//     payload = jwt.verify(token, 'super-secret_key');
//   } catch (err) {
//     return handleAuthError(res);
//   }
//
//   req.user = payload; // записываем пейлоуд в объект запроса
//   console.log(req.user);
//   next(); // пропускаем запрос дальше
// };

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret_key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
