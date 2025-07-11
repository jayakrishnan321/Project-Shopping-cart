const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");
const jwt=require('jsonwebtoken');
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
const loginAdmin=async(req,res)=>{
    const {email,password}=req.body

    const admin= await Admin.findOne({email:email})
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch= await bcrypt.compare(password,admin.password);
    if (!isMatch) return res.status(400).json({ message: 'enter correct password' });

     const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
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
    // 1. Find the admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update and save
    admin.password = hashedNewPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerAdmin,
  verifyOTP,
  loginAdmin,
  ChangePassword
};
