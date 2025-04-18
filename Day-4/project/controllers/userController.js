const { users } = require('../models/user');

const getProfile = (req, res) => {
  res.json({ email: req.user.email });
};

const getAllUsers = (req, res) => {
  res.json(users.map((user) => ({ id: user.id, email: user.email })));
};

const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted' });
};

module.exports = { getProfile, getAllUsers, deleteUser };