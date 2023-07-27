const countriesBordersGeojson = require("./CountryBordersGeojson");
const fs = require("fs");
const path = require("path");

async function insertData() {
  const filePath = path.join(__dirname, "countryBordersGeojson.json");

  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);

  await countriesBordersGeojson.deleteMany({});

  try {
    const result = await countriesBordersGeojson.insertMany(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = insertData;
