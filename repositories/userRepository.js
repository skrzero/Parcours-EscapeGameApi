// repositories/userRepository.js
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'users.json');

let users = []; // Base en mémoire
try {
  const data = fs.readFileSync(filePath, 'utf-8');
  users = JSON.parse(data);
} catch (err) {
  users = [];
}

function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

function createUser(user) {
  users.push(user);
  return user;
}

function getAllUsers() {
  return users;
}

module.exports = {
  users,
  findUserByUsername,
  createUser,
  getAllUsers,
};
