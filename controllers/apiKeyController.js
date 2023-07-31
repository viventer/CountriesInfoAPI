const User = require("../model/User");

const { v4: uuidv4 } = require("uuid");

const getNewApiKey = async (req, res) => {
  const loggedUser = getLoggedUser(req.user);
  if (!loggedUser) {
    return res.status(401);
  }
  const newApiKey = uuidv4().replace(/-/g, "");
  res.json(newApiKey);
};

const getAllUserApiKeys = async (req, res) => {};

const deleteAllUserApiKeys = async (req, res) => {};

const deleteUserApiKey = async (req, res) => {};

const getLoggedUser = async (username) => {
  const loggedUser = await User.findOne({ username }).exec();
  return loggedUser;
};

module.exports = {
  getNewApiKey,
  getAllUserApiKeys,
  deleteAllUserApiKeys,
  deleteUserApiKey,
};
