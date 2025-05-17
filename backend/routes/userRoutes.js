const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getChangeHistory,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.get("/me", protect, getProfile);

router.put(
  "/me",
  protect,
  [
    body("username").optional().isLength({ min: 3 }),
    body("email").optional().isEmail(),
    body("phone").optional().isMobilePhone(),
  ],
  updateProfile
);

// Admin routes
router.get("/admin/users", protect, adminOnly, getAllUsers);
router.get("/admin/changes", protect, adminOnly, getChangeHistory);

module.exports = router;
