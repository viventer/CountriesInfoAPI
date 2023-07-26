const express = require("express");
const router = express.Router();
const countriesBordersController = require("../../controllers/countriesBordersController");

router.route("/").get(countriesBordersController.getAllCountriesBorders);

router.route("/:countryCode").get(countriesBordersController.getCountryBorders);

module.exports = router;
