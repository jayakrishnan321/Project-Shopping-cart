const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { usersendOTP } = require("../utils/sendOTP");
const jwt = require('jsonwebtoken');
const path = require("path");

const otpStore = {};

const registerUser = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;


  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp,
    data: { name, email, phone, password },
    expires: Date.now() + 300000,
  };

  await usersendOTP(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record || record.otp !== otp || Date.now() > record.expires)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  const hashedPassword = await bcrypt.hash(record.data.password, 10);

  await User.create({ ...record.data, password: hashedPassword });
  delete otpStore[email];

  res.status(201).json({ message: "User registered successfully" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'enter correct password' });

  const token = jwt.sign({ id: user._id, email: user.email, name: user.name, image: user.image }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.status(200).json({
    message: 'Login successful',
    token,

  });
}
module.exports={
    registerUser,
    verifyOTP,
    loginUser
}