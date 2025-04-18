const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, getAllUsers, deleteUser } = require('../controllers/userController');

router.get('/me', auth, getProfile);
router.get('/', auth, getAllUsers);
router.delete('/:id', auth, deleteUser);

module.exports = router;