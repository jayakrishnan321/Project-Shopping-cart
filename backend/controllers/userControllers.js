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
const ChangePassword = async (req, res) => {
  const { email } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const addimage = async (req, res) => {
  try {
    const email = req.params.email;
    const imagePath = req.file ? `/profile/${req.file.filename}` : "";

    const user = await User.findOneAndUpdate(
      { email },
      { image: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Profile image updated", user });
  } catch (error) {
    console.error("Add image error:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
};
const removeProfileImage = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOneAndUpdate(
      { email },
      { image: "" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Profile image removed", user });
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).json({ message: "Failed to remove profile image" });
  }
};
module.exports={
    registerUser,
    verifyOTP,
    loginUser,
    addimage,
    removeProfileImage,
    ChangePassword
}