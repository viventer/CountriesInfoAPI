const express = require("express");
const app = express();
require("express-async-errors");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const getLoggedUser = require("./middleware/getLoggedUser");
const credentials = require("./middleware/credentials");

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(credentials);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use("/countries-borders", require("./routes/api/countriesBorders.js"));
app.use("/countries-info", require("./routes/api/countriesInfo.js"));

app.use(verifyJWT);
app.use(getLoggedUser);
app.use("/api-key", require("./routes/api/apiKey"));

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
