const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");

const otpStore = {}; // Use Redis in production

const registerAdmin = async (req, res) => {
  const { name, email, phone, password, confirmPassword, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY)
    return res.status(401).json({ message: "Invalid secret key" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin)
    return res.status(400).json({ message: "Email already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp,
    data: { name, email, phone, password },
    expires: Date.now() + 300000, // 5 mins
  };

  await sendOTP(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  const hashedPassword = await bcrypt.hash(record.data.password, 10);
  await Admin.create({ ...record.data, password: hashedPassword });
  delete otpStore[email];

  res.status(201).json({ message: "Admin registered successfully" });
};

module.exports = {
  registerAdmin,
  verifyOTP,
};
