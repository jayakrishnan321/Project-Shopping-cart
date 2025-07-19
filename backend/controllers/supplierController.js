const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const { sendsupplierOTP,sendAdminApprovalEmail } = require("../utils/sendOTP");
const jwt = require('jsonwebtoken');
const path = require("path");
const Admin=require('../models/Admin')

const otpStore = {};

const ChangePassword = async (req, res) => {
  const { email } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, supplier.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

   supplier.password = hashedNewPassword;
    await supplier.save();

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

    const supplier= await Supplier.findOneAndUpdate(
      { email },
      { image: imagePath },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "supplier not found" });
    }

    res.status(200).json({ message: "Profile image updated", supplier });
  } catch (error) {
    console.error("Add image error:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
};
const removeProfileImage = async (req, res) => {
  try {
    const email = req.params.email;

    const supplier = await Supplier.findOneAndUpdate(
      { email },
      { image: "" },
      { new: true }
    );

    if (!supplier) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Profile image removed", supplier });
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).json({ message: "Failed to remove profile image" });
  }
};
const registersupllier = async (req, res) => {
    const { name, email, phone, password } = req.body;
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier)
        return res.status(400).json({ message: "Email already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
        otp,
        data: { name, email, phone, password },
        expires: Date.now() + 300000,
    };

    await sendsupplierOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
};
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { name, phone, password } = record.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSupplier = new Supplier({
      name,
      email,
      phone,
      password: hashedPassword,
      status: "pending",
    });

    await newSupplier.save();

    delete otpStore[email];

    const admins = await Admin.find({}, "email");
    console.log("Admins found:", admins);
    const adminEmails = admins.map(admin => admin.email);

    await sendAdminApprovalEmail(adminEmails, newSupplier.name, newSupplier.email);

    res.status(201).json({ message: "OTP verified. Waiting for admin approval." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

const loginSupplier = async (req, res) => {
    const { email, password } = req.body;

    try {
        const supplier = await Supplier.findOne({ email });
        if (!supplier) return res.status(400).json({ message: 'User not found' });

        // Check if user is approved
        if (supplier.status !== 'approved') {
            return res.status(403).json({ message: `Admin will accept soon. Status: ${supplier.status}` });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, supplier.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign(
            { id: supplier._id, email: supplier.email, name: supplier.name,image:supplier.image },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // ✅ Send success message and supplier details
        res.json({
            message: 'Login successful',
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registersupllier, verifyOTP, loginSupplier,addimage,removeProfileImage,ChangePassword
}