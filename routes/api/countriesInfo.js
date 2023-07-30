const express = require("express");
const router = express.Router();
const countriesInfoController = require("../../controllers/countriesInfoController");

router.route("/").get(countriesInfoController.getAllCountriesInfo);

router.route("/:countryCode").get(countriesInfoController.getCountryInfo);

module.exports = router;
