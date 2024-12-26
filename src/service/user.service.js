const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const createUser = async (userBody) => {
  
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.OK, "Email already taken");
  } else {
    // const hashedPassword = await bcrypt.hash(userBody.password, 10);
    console.log("userBody", userBody);
    const newUser = await User.create(userBody);

    return newUser;
  }
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const getUserByToken = async (remembertoken) => {
  return await User.findOne({ remembertoken: remembertoken });
};

module.exports = { createUser, getUserByEmail, getUserByToken };
