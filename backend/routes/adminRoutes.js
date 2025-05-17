const express = require("express");
const router = express.Router();

const { getAllUsers, getUserStats, getUserHistory } = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

router.use(authMiddleware, isAdmin);
router.get("/stats", getUserStats);
router.get("/users", getAllUsers);
router.get("/history", getUserHistory);

module.exports = router;
