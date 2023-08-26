const express = require("express");
const router = express.Router();

const countriesBordersController = require("../../controllers/countriesBordersController");

const getUser = require("../../middleware/getUser");
const verifyApiKey = require("../../middleware/verifyApiKey");

router.use(getUser);
router.use(verifyApiKey);

router.route("/").get(countriesBordersController.getAllCountriesBorders);

router.route("/:countryCode").get(countriesBordersController.getCountryBorders);

module.exports = router;
