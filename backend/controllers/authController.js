const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // code 6 chiffres
}

exports.register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);
    const code = generateCode();

    const user = await User.create({
      username,
      email,
      phone,
      password: hashed,
      verificationCode: code,
    });

    sendEmail(email, "Code de vérification", `Votre code : ${code}`);

    res.status(201).json({ message: "Utilisateur créé. Vérifiez votre email." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.verifyAccount = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  if (user.verified) return res.status(400).json({ message: "Déjà vérifié" });

  if (user.verificationCode !== code)
    return res.status(400).json({ message: "Code incorrect" });

  user.verified = true;
  user.verificationCode = undefined;
  await user.save();

  res.json({ message: "Compte vérifié avec succès" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  if (!user.verified) return res.status(403).json({ message: "Compte non vérifié" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = generateToken(user);
  res.json({ message: "Connecté", token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const code = generateCode();
  user.resetPasswordCode = code;
  await user.save();

  sendEmail(email, "Code de réinitialisation", `Code : ${code}`);

  res.json({ message: "Code envoyé par email" });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  if (user.resetPasswordCode !== code)
    return res.status(400).json({ message: "Code invalide" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordCode = undefined;
  await user.save();

  res.json({ message: "Mot de passe réinitialisé avec succès" });
};
