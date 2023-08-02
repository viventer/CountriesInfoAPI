const verifyApiKey = (req, res, next) => {
  const loggedUser = req.loggedUser;
  const providedApiKey = req?.headers?.["x-api-key"];
  if (!providedApiKey) {
    return res.status(400).json({ message: "Api key required" });
  }

  const validApiKeys = loggedUser.apiKeys;
  const isApiKeyValid = validApiKeys.includes(providedApiKey);
  if (!isApiKeyValid) {
    return res.status(403).json({ message: "Provided api key is not valid" });
  }

  next();
};

module.exports = verifyApiKey;
