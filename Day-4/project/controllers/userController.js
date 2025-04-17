const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

const userController = {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.createUser(email, password);
      res.status(201).json(user);
    } catch (err) {
      if (err.message === 'Email and password required' || err.message === 'Email already exists') {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h'
      });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await UserModel.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ email: user.email });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async deleteUser(req, res) {
    try {
      await UserModel.deleteUser(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
};

module.exports = userController;