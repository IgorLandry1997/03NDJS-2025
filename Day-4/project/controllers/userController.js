const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getUsers, addUser, findUserByEmail, findUserById, deleteUserById } = require('../models/userModel');

const JWT_SECRET = 'your-secret-key';

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hashedPassword };
  addUser(user);

  res.status(201).json({ id: user.id, email: user.email });
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
