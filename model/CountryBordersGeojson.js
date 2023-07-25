const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countryBordersGeojsonSchema = new Schema({
  type: {
    type: String,
    default: "Feature",
  },
  geometry: {
    type: {
      type: String,
      default: "Polygon",
    },
    coordinates: {
      type: Array,
      required: true,
    },
  },
  properties: {
    ADMIN: {
      type: String,
      required: true,
    },
    ISO_A3: {
      type: String,
      required: true,
    },
    ISO_A2: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model(
  "CountryBordersGeojson",
  countryBordersGeojsonSchema
);
