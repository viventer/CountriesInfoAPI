const express = require("express");
const router = express.Router();

const apiKeyController = require("../../controllers/apiKeyController");

router.route("/generate").get(apiKeyController.getNewApiKey);

router
  .route("/all")
  .get(apiKeyController.getAllUserApiKeys)
  .delete(apiKeyController.deleteAllUserApiKeys);

router.route("/:id").delete(apiKeyController.deleteUserApiKey);

module.exports = router;
