const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../service");
const Customer = require("../models/customerSchema");
const { User } = require("../models/user.model");


const register = catchAsync(async (req, res) => {
  if (!req.file) {
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

// const login = catchAsync(async (req, res) => {
//   const { email, password, type } = req.body;
//   if (!email && !password) {
//     res.status(404).json({ success: false, message: "Empty Feilds." })
//   }


//   const user = await authService.loginUserWithEmailAndPassword(email, password,type);
//   if(!user){
//     res.status(404).json({success:false, message:"Login failed."})
//   }
  
//   const tokens = type === "customer" ? await tokenService.generateAuthCustomerTokens(user) : await tokenService.generateAuthTokens(user)
  
//   res.status(200).send({success: true ,  data: tokens });
// });


const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (!user) {
    res.status(400).json({success: false, message:"Login failed."})
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(200).send({success: true, message:"Login Successfull", data: tokens });
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
