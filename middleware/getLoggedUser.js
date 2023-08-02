const User = require("../model/User");

const getLoggedUser = async (req, res, next) => {
  const loggedUser = await User.findOne({ username: req.user }).exec();
  req.loggedUser = loggedUser;
  next();
};

module.exports = getLoggedUser;
