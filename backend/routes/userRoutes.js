const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getProfile,
  updateUsername,
  updateEmail,
  verifyNewEmail,
  updatePhone,
  verifyNewPhone,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validatorMiddleware");

router.get("/profile", authMiddleware, getProfile);

router.put(
  "/update-username",
  authMiddleware,
  [body("username").notEmpty().withMessage("Nom requis")],
  validate,
  updateUsername
);

router.post(
  "/update-email",
  authMiddleware,
  [body("newEmail").isEmail().withMessage("Email invalide")],
  validate,
  updateEmail
);

router.post(
  "/verify-email",
  authMiddleware,
  [
    body("code").notEmpty().withMessage("Code requis"),
    body("newEmail").isEmail().withMessage("Email requis"),
  ],
  validate,
  verifyNewEmail
);

router.post(
  "/update-phone",
  authMiddleware,
  [body("newPhone").notEmpty().withMessage("Téléphone requis")],
  validate,
  updatePhone
);

router.post(
  "/verify-phone",
  authMiddleware,
  [
    body("code").notEmpty().withMessage("Code requis"),
    body("newPhone").notEmpty().withMessage("Téléphone requis"),
  ],
  validate,
  verifyNewPhone
);

module.exports = router;
