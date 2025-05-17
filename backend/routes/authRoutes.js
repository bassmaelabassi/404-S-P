const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  register,
  verifyAccount,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const validate = require("../middlewares/validatorMiddleware");

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Nom requis"),
    body("email").isEmail().withMessage("Email invalide"),
    body("phone").notEmpty().withMessage("Téléphone requis"),
    body("password").isLength({ min: 6 }).withMessage("Mot de passe min 6 caractères"),
  ],
  validate,
  register
);

router.post(
  "/verify",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("code").notEmpty().withMessage("Code requis"),
  ],
  validate,
  verifyAccount
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
  ],
  validate,
  login
);

router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Email invalide"),
  ],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("code").notEmpty().withMessage("Code requis"),
    body("newPassword").isLength({ min: 6 }).withMessage("Nouveau mot de passe requis"),
  ],
  validate,
  resetPassword
);

module.exports = router;
