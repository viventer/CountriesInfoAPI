const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countryInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ISO_A2: {
    type: String,
    required: true,
  },
  ISO_A3: {
    type: String,
    required: true,
  },
  currencies: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  capitalCity: {
    type: String,
    required: true,
  },
  continents: {
    type: [String],
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  mainReligion: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  nominalGDPPerCapita: {
    type: Number,
    required: true,
  },
  drivingSide: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CountryInfo", countryInfoSchema);
