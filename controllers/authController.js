const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  // TODO : Récupérer le nom d'utilisateur username et le mot de passe password depuis le corps de la requête

  if (!username || !password) {
    console.log(" ⚠️ Registration failed: Missing username or password");
    return res.status(400).json({ error: "Username and password are required" });
  }

  const existing = userRepo.findUserByUsername(username);
  if (existing) {
    console.log(" ⚠️ Registration failed: User already exists");
    return res.status(400).json({ error: "User already exists" });
  }

  // TODO : Hash the password before storing it
  const hash = ;
  const user = userRepo.createUser({ username, password: hash, currentRoom: 1 });

  // TODO : Return a success message 

};

exports.login = async (req, res) => {
  // TODO : Récupérer le nom d'utilisateur username et le mot de passe password depuis le corps de la requête
  

  console.log("Login attempt for:", username);

  const user = userRepo.findUserByUsername(username);
  // TODO : Vérifier si l'utilisateur existe sinon retourner un statut 401

  // Compare the provided password with the stored hash
  const match =;
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  console.log(" ✅ User authenticated:", username);
  // TODO : Sign the JWT token with the username and JWT_SECRET
  const token = ;
  // TODO : Return the token in the response in json

};

exports.me = (req, res) => {
  res.json({ user: req.user });
};

