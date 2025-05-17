const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateUsername = async (req, res) => {
  const user = await User.findById(req.user.id);
  const oldUsername = user.username;
  user.username = req.body.username;

  await user.save();

  user.history.push({
    field: "username",
    oldValue: oldUsername,
    newValue: req.body.username,
  });
  await user.save();

  res.json({ message: "Nom modifié avec succès" });
};

exports.updateEmail = async (req, res) => {
  const code = generateCode();
  const { newEmail } = req.body;

  const user = await User.findById(req.user.id);
  user.tempEmail = newEmail;
  user.emailVerificationCode = code;

  await user.save();
  sendEmail(newEmail, "Code de confirmation email", `Code : ${code}`);

  res.json({ message: "Code envoyé au nouvel email" });
};

exports.verifyNewEmail = async (req, res) => {
  const { code, newEmail } = req.body;
  const user = await User.findById(req.user.id);

  if (user.emailVerificationCode !== code || user.tempEmail !== newEmail)
    return res.status(400).json({ message: "Code ou email invalide" });

  user.history.push({
    field: "email",
    oldValue: user.email,
    newValue: newEmail,
  });

  user.email = newEmail;
  user.tempEmail = undefined;
  user.emailVerificationCode = undefined;
  await user.save();

  res.json({ message: "Email mis à jour" });
};

exports.updatePhone = async (req, res) => {
  const { newPhone } = req.body;
  const code = generateCode();

  const user = await User.findById(req.user.id);
  user.tempPhone = newPhone;
  user.phoneVerificationCode = code;

  await user.save();
  console.log(`Code de vérification envoyé à ${newPhone} : ${code}`);

  res.json({ message: "Code envoyé au téléphone (mock)" });
};

exports.verifyNewPhone = async (req, res) => {
  const { code, newPhone } = req.body;
  const user = await User.findById(req.user.id);

  if (user.phoneVerificationCode !== code || user.tempPhone !== newPhone)
    return res.status(400).json({ message: "Code ou téléphone invalide" });

  user.history.push({
    field: "phone",
    oldValue: user.phone,
    newValue: newPhone,
  });

  user.phone = newPhone;
  user.tempPhone = undefined;
  user.phoneVerificationCode = undefined;
  await user.save();

  res.json({ message: "Téléphone mis à jour" });
};
