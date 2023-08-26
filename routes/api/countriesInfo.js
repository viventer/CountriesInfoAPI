const express = require("express");
const router = express.Router();

const countriesInfoController = require("../../controllers/countriesInfoController");

const getUser = require("../../middleware/getUser");
const verifyApiKey = require("../../middleware/verifyApiKey");

router.use(getUser);
router.use(verifyApiKey);

router.route("/").get(countriesInfoController.getAllCountriesInfo);

router.route("/:countryCode").get(countriesInfoController.getCountryInfo);

module.exports = router;
