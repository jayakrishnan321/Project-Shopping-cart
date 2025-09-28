const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const { sendsupplierOTP,sendAdminApprovalEmail,sendEmailToAdmin ,sendOTPorder,sendSuccesmessage} = require("../utils/sendOTP");
const jwt = require('jsonwebtoken');
const path = require("path");
const Admin=require('../models/Admin')
const Order = require("../models/Order");
const otpStore = {};
const orderOTPStore={};
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
            { id: supplier._id,
               email: supplier.email,
                name: supplier.name,
                image:supplier.image,
               
                
             },
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
const updateplaceanddistrict = async (req, res) => {
  try {
    const { district, place } = req.body;
    const supplier = await Supplier.findOne({ email: req.params.email });

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Save updates as pending
    supplier.pendingDetails = { district, place };
    await supplier.save();

    // Notify admin
    const admins = await Admin.find({}, "email");
    const adminEmails = admins.map((admin) => admin.email);

    await sendEmailToAdmin({
      to: adminEmails.join(","),
      subject: "Supplier Details Update Request",
      text: `Supplier ${supplier.name} has requested an update:\nDistrict: ${district}\nPlace: ${place}\nPlease approve or reject.`,
    });

    res.json({
      message: "Update request sent for admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchcurrentorders = async (req, res) => {
  try {
    const { place, district } = req.params;

    // Find orders where the address contains BOTH place and district
    const orders = await Order.find({
      address: { $regex: new RegExp(`${place}.*${district}`, "i") },
      status:"Processing"
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch current orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendOrderOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    orderOTPStore[id] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Valid for 5 mins

    // Send OTP to user's email
    await sendOTPorder(order.userEmail, otp);

    res.json({ message: "OTP sent to user's email" });
  } catch (error) {
    console.error("OTP sending error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
const verifyOrderOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const record = orderOTPStore[id];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark order as Delivered
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Delivered" },
      { new: true }
    );
    delete orderOTPStore[id];

    res.json({ message: "Order delivered successfully", order });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
const checkSupplierAvailability = async (req, res) => {
  try {
    const district = req.params.district.trim();
    const place = req.params.place.trim();

    console.log("District param:", `"${district}"`);
    console.log("Place param:", `"${place}"`);

    const supplier = await Supplier.findOne({
      place: new RegExp(`^${place}$`, "i"),
      district: new RegExp(`^${district}$`, "i"),
      status: "approved",
    });

    console.log("Supplier found:", supplier);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `No supplier available for ${place}, ${district}`,
      });
    }

    res.json({ success: true, supplier });
  } catch (err) {
    console.error("Supplier check error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const sendsuccesmessage=async(req,res)=>{
  try{
   const id=req.params.id
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await sendSuccesmessage(order.userEmail);

    res.json({ message: "OTP sent to user's email" });
  } catch (error) {
    console.error("OTP sending error:", error);
    res.status(500).json({ message: "Failed " });
  }

}
const getplaceanddistrict=async(req,res)=>{
  try{
    const email=req.params.email
    const supplier=await Supplier.findOne({
      email:email
    })
    res.status(200).json(supplier);

  }catch(error){
    res.status(500).json({message:'failed'})
  }
}

module.exports = {
    registersupllier, verifyOTP, loginSupplier,addimage,removeProfileImage,ChangePassword,updateplaceanddistrict,fetchcurrentorders,
    sendOrderOTP,verifyOrderOTP,checkSupplierAvailability,sendsuccesmessage,getplaceanddistrict
}