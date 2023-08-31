const User = require("../model/User");

const getUser = async (req, res, next) => {
  if (!req?.headers?.username) {
    return res.status(400).json({ message: "Username required" });
  }

  const user = await User.findOne({ username: req.headers.username }).exec();
  if (!user) {
    return res
      .status(403)
      .json({ message: "User with provided username doesn't exist" });
  }

  req.user = user;
  next();
};

module.exports = getUser;
