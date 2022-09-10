const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(userRoutes);
router.use(cardRoutes);

router.use((req, res, next) => {
  next(NotFoundError('Страница не найдена'));
});

module.exports = router;
