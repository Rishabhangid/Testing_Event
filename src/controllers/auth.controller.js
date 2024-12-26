const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../service");


const register = catchAsync(async (req, res) => {
  if(!req.file){
    res.status(400).send({ message: "Profile Picture is required" });
  }
  const user = await userService.createUser({
    ...req.body,
    profile_picture: req?.file?.filename,
  });
  const tokens = await tokenService.generateAuthTokens(user);
  if (tokens) {
    res.status(200).send({ data: tokens });
  }
  res.status(400).send({ message: "Somthing went Wroung Please try Again" });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (!user) {
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(200).send({ data: tokens });
});

const logout = catchAsync(async (req, res) => {
  const { token } = req.body;
  await authService.logoutUser(token);
  res.status(httpStatus.OK).send({ message: "Logout successful" });
});

module.exports = {
  register,
  login,
  logout,
};
