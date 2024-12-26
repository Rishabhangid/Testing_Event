const  bcrypt= require("bcryptjs");
const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  const isPasswordMatch =await  bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }
  return user;
};

const logoutUser = async (token) => {
  const user = await userService.getUserByToken(token);
  if (user) {
    user.remembertoken = '';
    await user.save();
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logoutUser
};