// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/user');

const register = async (req, res) => {
  console.log('Register request received:', req.body); // Added for debugging
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      console.log('Validation failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for duplicate email
    if (users.find((user) => user.email === email)) {
      console.log('Validation failed: Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log('Creating user...');
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
    };
    users.push(user);

    console.log('User created:', user);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  console.log('Login request received:', req.body); // Added for debugging
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    console.log('Generating JWT...');
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };