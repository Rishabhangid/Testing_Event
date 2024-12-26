const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens.js");
const { User } = require("../models/user.model");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const Payload = {
    sub: userId,
    iat: Math.floor(Date.now / 1000),
    type: type,
    exp: expires
  }
  return jwt.sign(Payload, secret)
};

const generateAuthTokens = async (user) => {
 
  
  const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  
  const accessToken = generateToken(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  await User.updateOne(
    { _id: user._id },
    { $set: { remembertoken: accessToken } }
  );
  // Retrieve the updated user document
  const updatedUser = await User.findById(user._id);
  return {
    token: accessToken,
    expires: new Date(accessTokenExpires * 1000),
    user: updatedUser
};
}
/**
 
  const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const accessToken = generateToken(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    }
  }



 */

module.exports = {
  generateToken,
  generateAuthTokens,
};