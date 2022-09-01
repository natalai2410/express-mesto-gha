const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

router.post('/users/me', updateUser);
router.post('/users/me/avatar', updateAvatar);

module.exports = router;
