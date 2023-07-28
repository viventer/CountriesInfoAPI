const countriesBordersGeojson = require("./CountryBordersGeojson");
const fs = require("fs");
const path = require("path");

async function insertCountryBordersGeojson() {
  const filePath = path.join(__dirname, "countryBordersGeojson.json");

  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);

  await countriesBordersGeojson.deleteMany({});

  const { features: rawFeaturesData } = data;

  const formattedFeaturesData = rawFeaturesData.map((feature) => {
    return { type: "FeatureCollection", features: [feature] };
  });

  try {
    const result = await countriesBordersGeojson.insertMany(
      formattedFeaturesData
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = insertCountryBordersGeojson;
