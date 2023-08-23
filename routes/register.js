const express = require("express");
const router = express.Router();
// const registerController = require("../controllers/registerController");
const { register } = require("../controllers/authController");

router.post("/", register);

module.exports = router;
