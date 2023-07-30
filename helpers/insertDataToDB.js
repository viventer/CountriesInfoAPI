const countriesBordersGeojson = require("../model/CountryBordersGeojson");
const CountryInfo = require("../model/CountryInfo");
const fs = require("fs");
const path = require("path");

async function insertCountryBordersGeojson() {
  // delete all the old data from db
  await countriesBordersGeojson.deleteMany({});

  const data = readData("countryBordersGeojson.json");

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

async function insertCountryInfo() {
  await CountryInfo.deleteMany({});

  const data = readData("countryInfo.json");

  try {
    const result = await CountryInfo.insertMany(data);
  } catch (error) {
    console.error(error);
  }
}

function readData(fileName) {
  const filePath = path.join(__dirname, fileName);

  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);

  return data;
}

module.exports = {
  insertCountryBordersGeojson,
  insertCountryInfo,
};
