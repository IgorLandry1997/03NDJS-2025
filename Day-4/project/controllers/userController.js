const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getUsers, addUser, findUserByEmail, findUserById, deleteUserById } = require('../models/userModel');

const JWT_SECRET = 'your-secret-key';

const register = async (req, res) => {
  console.log('Register started:', req.body);
  try {
    const { email, password } = req.body;

    console.log('Checking email and password');
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }

    console.log('Calling findUserByEmail');
    const existingUser = findUserByEmail(email);
    console.log('findUserByEmail result:', existingUser);
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');
    const user = { id: uuidv4(), email, password: hashedPassword };
    console.log('Calling addUser:', user);
    addUser(user);
    console.log('User added');

    console.log('Sending response');
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

const getProfile = (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ email: user.email });
};

const getAllUsers = (req, res) => {
  res.json(getUsers().map(({ id, email }) => ({ id, email })));
};

const deleteUser = (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  deleteUserById(req.params.id);
  res.json({ message: 'User deleted' });
};

module.exports = { register, login, getProfile, getAllUsers, deleteUser };