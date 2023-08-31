const fs = require("fs");
const path = require("path");

const countriesBordersGeojson = require("../model/CountryBordersGeojson");
const CountryInfo = require("../model/CountryInfo");

async function insertCountryBordersGeojson(fileName) {
  // delete all the old data from db
  await countriesBordersGeojson.deleteMany({});

  const data = readData(fileName);

  const { features: rawFeaturesData } = data;

  const formattedFeaturesData = rawFeaturesData.map((feature) => {
    return { type: "FeatureCollection", features: [feature] };
  });

  try {
    await countriesBordersGeojson.insertMany(formattedFeaturesData);
  } catch (error) {
    console.error(error);
  }
}

async function insertCountryInfo(fileName) {
  await CountryInfo.deleteMany({});

  const data = readData(fileName);

  try {
    await CountryInfo.insertMany(data);
  } catch (error) {
    console.error(error);
  }
}

function readData(fileName) {
  const filePath = getPath(fileName);

  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);

  return data;
}

function getPath(fileName) {
  return `../model/${fileName}`;
}

module.exports = {
  insertCountryBordersGeojson,
  insertCountryInfo,
};
