let users = [];

const getUsers = () => users;

const addUser = (user) => {
  users.push(user);
};

const findUserByEmail = (email) => users.find(user => user.email === email);

const findUserById = (id) => users.find(user => user.id === id);

const deleteUserById = (id) => {
  users = users.filter(user => user.id !== id);
};

module.exports = { getUsers, addUser, findUserByEmail, findUserById, deleteUserById };