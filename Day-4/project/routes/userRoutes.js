const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getProfile);
router.get('/users', authenticateToken, getAllUsers);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;