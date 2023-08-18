const { v4: uuidv4 } = require("uuid");

const getNewApiKey = async (req, res) => {
  const loggedUser = req.loggedUser;

  const MAX_API_KEYS_NUMBER = 3;
  const userApiKeysNumber = loggedUser.apiKeys.length;
  if (userApiKeysNumber >= MAX_API_KEYS_NUMBER) {
    return res
      .status(403)
      .json({ message: "Maximum number of API keys reached" });
  }

  const newApiKey = uuidv4().replace(/-/g, "");
  loggedUser.apiKeys.push(newApiKey);

  await loggedUser.save();

  res.json(newApiKey);
};

const getAllUserApiKeys = async (req, res) => {
  const loggedUser = req.loggedUser;

  return res.json(loggedUser.apiKeys);
};

const deleteAllUserApiKeys = async (req, res) => {
  const loggedUser = await getLoggedUser(req.username);

  const userApiKeysNumber = loggedUser.apiKeys.length;
  if (userApiKeysNumber < 1) {
    return res.json({ message: "There is no api key to delete" });
  }

  loggedUser.apiKeys = [];

  await loggedUser.save();

  res.json({ message: "All api keys have been removed" });
};

const deleteUserApiKey = async (req, res) => {
  const loggedUser = req.loggedUser;

  const apiKeyId = req?.params?.id;
  if (!apiKeyId) {
    return res.status(400).json({ message: "Id required" });
  }

  const userApiKeys = loggedUser.apiKeys;
  if (!userApiKeys) {
    return res.json({ message: "User doesn't have any api key" });
  }

  const searchedApiKey = userApiKeys[apiKeyId];
  if (!searchedApiKey) {
    return res.json({ message: "There is no api key with provided id" });
  }

  loggedUser.apiKeys.splice(apiKeyId, 1);

  await loggedUser.save();

  res.json({ message: `The api key with id ${apiKeyId} have been removed` });
};

module.exports = {
  getNewApiKey,
  getAllUserApiKeys,
  deleteAllUserApiKeys,
  deleteUserApiKey,
};
