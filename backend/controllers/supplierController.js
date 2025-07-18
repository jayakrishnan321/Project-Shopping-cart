const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const { sendsupplierOTP,sendAdminApprovalEmail } = require("../utils/sendOTP");
const jwt = require('jsonwebtoken');
const path = require("path");
const Admin=require('../models/Admin')

const otpStore = {};

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
            { id: supplier._id, email: supplier.email, name: supplier.name },
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
    registersupllier, verifyOTP, loginSupplier
}