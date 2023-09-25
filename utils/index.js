const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
exports.hashString = async (val) => {
  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(val, salt);

  return hashedPassword;
};

exports.comparePassword = async (userPassword, password) => {
  const compare = await bcrypt.compare(userPassword, password);
  return compare;
};

exports.createJWT = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
