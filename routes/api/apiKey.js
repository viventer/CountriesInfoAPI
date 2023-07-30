const express = require("express");
const router = express.Router();
const apiKeyController = require("../../controllers/apiKeyController");

router.route("/").get(apiKeyController.getAllApiKeys);

router
  .route("/:id")
  .get(apiKeyController.getApiKey)
  .delete(apiKeyController.deleteApiKey);
