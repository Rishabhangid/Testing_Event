const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../service");
const Customer = require("../models/customerSchema");
const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");



//Admin,and other
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

// Login Admin, Agency....
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (!user) {
    res.status(400).json({ success: false, message: "Login failed." })
  }
  // const { remembertoken, ...userWithoutToken } = user.toObject();
  // console.log(userWithoutToken)
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(200).send({ success: true, message: "Login Successfull", data: tokens });
  // res.status(200).send({success: true, message:"Login Successfull", data: userWithoutToken });
});

// Logout Admin , Agency
const logout = catchAsync(async (req, res) => {
  const { token } = req.body;
  await authService.logoutUser(token);
  res.status(httpStatus.OK).send({ message: "Logout successful" });
});

// Get User Info By Token
// const get_userInfo_token = async (req, res) => {
//   try {
//     //  console.log("user id: ",req.user.sub)
//     const find_user_info = await User.findById({ _id: req.user.sub }) || Customer.findById({ _id: req.user.sub });
//      console.log("user details :",find_user_info)
//     res.status(200).json({ success: true, message: "User Details Found.", find_user_info })
//   }
//   catch (error) {
//     console.log(error)
//     res.status(500).json({ success: true, error })
//   }
// }
const get_userInfo_token = async (req, res) => {
  try {
    // Try finding the user in the User model
    let find_user_info = await User.findById({ _id: req.user.sub });

    // If not found in the User model, search in the Customer model
    if (!find_user_info) {
      find_user_info = await Customer.findById({ _id: req.user.sub });
    }

    // If no user info found in both collections, return an error
    if (!find_user_info) {
      return res.status(404).json({ success: false, message: "User details not found" });
    }

    console.log("User details:", find_user_info);
    res.status(200).json({ success: true, message: "User Details Found.", find_user_info });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


//Customer Register
const registerCustomers = catchAsync(async (req, res) => {
  const { first_name, last_name, email, number, password, passwordcnfrm } = req.body;

  console.log("data", req.body);

  try {
    // Validation
    if (!first_name || !last_name || !email || !number || !password || !passwordcnfrm) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate if passwords match
    if (password !== passwordcnfrm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      number,
      password: hashedPassword,
    });

    const user = await tokenService.generateAuthTokens(newCustomer);

    // Save the customer
    await newCustomer.save();

    console.log("Customer Registered.");
    res.status(201).json({ success: true, message: "Customer registered successfully", data: user });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const registerCustomer = catchAsync(async (req, res) => {
  const { first_name, last_name, email, number, password, passwordcnfrm } = req.body;

  console.log("data", req.body);

  try {

    // Validation
    const requiredFields = ['first_name', 'last_name', 'email', 'number', 'password', 'passwordcnfrm'];

    // Check if any required field is missing or empty
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate if passwords match
    if (password !== passwordcnfrm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      number,
      password: hashedPassword,
      role: "676fa098eed94dcfee1f7163"
    });

    const user = await tokenService.generateAuthTokens(newCustomer);

    // Save the customer
    await newCustomer.save();

    console.log("Customer Registered.");
    res.status(201).json({ success: true, message: "Customer registered successfully", data: user, user: newCustomer });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




//  Customer Login
const loginCustomer = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the customer exists
    const customer = await Customer.findOne({ email }).select("-password"); // Exclude password
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Retrieve the full customer object with the password for validation
    const fullCustomer = await Customer.findOne({ email });

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, fullCustomer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Generate a JWT token (optional, if using JWT for authentication)
    const user = await tokenService.generateAuthTokens(fullCustomer);

    // Successful login response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user, // Include the token if you're using JWT
      user: customer, // `customer` already has the password excluded
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  register,
  login,
  logout,
  get_userInfo_token,
  registerCustomer,
  loginCustomer
};
