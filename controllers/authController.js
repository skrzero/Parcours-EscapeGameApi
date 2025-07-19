const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  // TODO : Récupérer le nom d'utilisateur username et le mot de passe password depuis le corps de la requête
const { username, password } = req.body;
  if (!username || !password) {
    console.log(" ⚠️ Registration failed: Missing username or password");
    return res.status(400).json({ error: "Username and password are required" });
  }

  const existing = userRepo.findUserByUsername(username);
  if (existing) {
    console.log(" ⚠️ Registration failed: User already exists");
    return res.status(400).json({ error: "User already exists" });
  }

  userRepository.createUser({ username, password });
  console.log(`[POST] /auth/register - ${username}`);
  res.status(201).json({ message: "Utilisateur créé" });


  // TODO : Hash the password before storing it
  const hash= await bcrypt.hash(password,10);
  const user = userRepo.createUser({ username, password: hash, currentRoom: 1 });

  // TODO : Return a success message 
   res.status(201).json({ message: 'Utilisateur créé ✅' });
};
console.log(' ok hash');

exports.login = async (req, res) => {
  // TODO : Récupérer le nom d'utilisateur username et le mot de passe password depuis le corps de la requête
  const { username, password } = req.body;

  console.log("Login attempt for:", username);

  const user = userRepo.findUserByUsername(username);
  // TODO : Vérifier si l'utilisateur existe sinon retourner un statut 401
  if (existing) {
    console.log(" ⚠️ Registration failed: User already exists");
    return res.status(401).json({ error: "User already exists" });
  }
  // Compare the provided password with the stored hash
  const match = userRepo.find(password == JWT_SECRET);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  console.log(" ✅ User authenticated:", username);
  // TODO : Sign the JWT token with the username and JWT_SECRET
  const token = jwt.sign(JWT_SECRET,username);
  // TODO : Return the token in the response in json
    return res.JSON(token);
};

exports.me = (req, res) => {
  res.json({ user: req.user });
};

