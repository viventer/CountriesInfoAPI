const CountryInfo = require("../model/CountryInfo");

const getAllCountriesInfo = async (req, res) => {
  const countriesInfo = await CountryInfo.find();
  if (!countriesInfo) {
    return res.status(400).json({ message: "No countries info found" });
  }
  res.json(countriesInfo);
};

const getCountryInfo = async (req, res) => {
  if (!req?.params?.countryCode) {
    return res.status(400).json({ message: "Country code required." });
  }
  const countryCode = req.params.countryCode;

  const codeType = countryCode.length < 3 ? "ISO_A2" : "ISO_A3";

  const countryInfo = await CountryInfo.findOne({ [codeType]: countryCode });
  if (!countryInfo) {
    return res
      .status(400)
      .json({ message: `No country matches code ${req.params.countryCode}` });
  }
  res.json(countryInfo);
};

module.exports = { getAllCountriesInfo, getCountryInfo };
