const fs = require("fs");

const CountryBordersGeojson = require("../model/CountryBordersGeojson");

const getAllCountriesBorders = async (req, res) => {
  const countriesBorders = await CountryBordersGeojson.find();
  if (!countriesBorders)
    return res.status(204).json({ message: "No countries borders found" });
  res.json(countriesBorders);
};

const getCountryBorders = async (req, res) => {
  if (!req?.params?.countryCode) {
    return res.status(400).json({ message: "Country code required." });
  }

  const codeType = req.params.countryCode.length < 3 ? "ISO_A2" : "ISO_A3";

  const query = {
    "features.properties": {
      [codeType]: req.params.countryCode,
    },
  };

  const countryBorders = await CountryBordersGeojson.findOne(query).exec();
  console.log(countryBorders);
  if (!countryBorders) {
    return res
      .status(204)
      .json({ message: `No country matches code ${req.params.countryCode}` });
  }
  res.json(countryBorders);
};

module.exports = {
  getAllCountriesBorders,
  getCountryBorders,
};
