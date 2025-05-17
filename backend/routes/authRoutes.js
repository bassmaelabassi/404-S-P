const express = require("express");
const router = express.Router();
const { register, login, confirmEmail } = require("../controllers/authController");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Nom trop court"),
    body("email").isEmail().withMessage("Email invalide"),
    body("password").isLength({ min: 6 }).withMessage("Mot de passe trop court"),
  ],
  register
);

router.post("/login", login);
router.get("/confirm/:token", confirmEmail);

module.exports = router;
