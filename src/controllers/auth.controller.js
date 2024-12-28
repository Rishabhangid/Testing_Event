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
  // const { remembertoken, ...userWithoutToken } = user.toObject();
  // console.log(userWithoutToken)
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(200).send({success: true, message:"Login Successfull", data: tokens });
  // res.status(200).send({success: true, message:"Login Successfull", data: userWithoutToken });
});

const logout = catchAsync(async (req, res) => {
  const { token } = req.body;
  await authService.logoutUser(token);
  res.status(httpStatus.OK).send({ message: "Logout successful" });
});

const get_userInfo_token = async (req, res)=>{
  try{
  //  console.log("user id: ",req.user.sub)
   const find_user_info = await User.findById({_id:req.user.sub})
  //  console.log("user details :",find_user_info)
   res.status(200).json({success: true, message:"User Details Found.", find_user_info})
  }
  catch (error){
    console.log(error)
    res.status(500).json({success: true, error})
  }
}

module.exports = {
  register,
  login,
  logout,
  get_userInfo_token
};
