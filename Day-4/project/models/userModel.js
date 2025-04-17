const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-memory storage
let users = [];

const UserModel = {
  async createUser(email, password) {
    if (!email || !password) {
      throw new Error('Email and password required');
    }

    if (users.find(user => user.email === email)) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword
    };

    users.push(user);
    const { password: _, ...userInfo } = user;
    return userInfo;
  },

  async findUserByEmail(email) {
    return users.find(user => user.email === email);
  },

  async findUserById(id) {
    return users.find(user => user.id === id);
  },

  getAllUsers() {
    return users.map(({ password, ...user }) => user);
  },

  deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    users.splice(userIndex, 1);
  }
};

module.exports = UserModel;