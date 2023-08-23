const express = require("express");
const router = express.Router();
// const logoutController = require("../controllers/logoutController");
const { logout } = require("../controllers/authController");

router.get("/", logout);

module.exports = router;
