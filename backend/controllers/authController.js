const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendConfirmationEmail = require("../utils/sendConfirmationEmail");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      isConfirmed: false,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    await sendConfirmationEmail(user.email, token);

    res.status(201).json({ msg: "Compte créé. Vérifiez votre email pour confirmer." });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", err });
  }
};

exports.confirmEmail = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur introuvable." });

    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ msg: "Email confirmé. Vous pouvez vous connecter." });
  } catch (err) {
    res.status(400).json({ msg: "Lien invalide ou expiré." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ msg: "Email ou mot de passe incorrect." });

    if (!user.isConfirmed)
      return res.status(401).json({ msg: "Veuillez confirmer votre email." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
