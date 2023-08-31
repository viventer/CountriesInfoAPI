const express = require("express");
const router = express.Router();

const { refresh } = require("../controllers/authController");

router.get("/", refresh);

module.exports = router;
