const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', authenticateToken, userController.getProfile);
router.get('/users', authenticateToken, userController.getAllUsers);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

module.exports = router;