const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");
const jwt = require('jsonwebtoken');
const path = require("path");
const User = require("../models/User");
const Supplier = require("../models/Supplier");

const otpStore = {};

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
    expires: Date.now() + 300000,
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
const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  const admin = await Admin.findOne({ email: email })
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'enter correct password' });

  const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name, image: admin.image }, process.env.JWT_SECRET, {
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
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedNewPassword;
    await admin.save();

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

    const admin = await Admin.findOneAndUpdate(
      { email },
      { image: imagePath },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Profile image updated", admin });
  } catch (error) {
    console.error("Add image error:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
};
const removeProfileImage = async (req, res) => {
  try {
    const email = req.params.email;

    const admin = await Admin.findOneAndUpdate(
      { email },
      { image: "" },
      { new: true }
    );

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Profile image removed", admin });
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).json({ message: "Failed to remove profile image" });
  }
};
const Userlist = async (req, res) => {
  try {
    const users = await User.find()
    return res.json(users)
  } catch (err) {
    console.log('cannot fetch user list')
  }
}
const Supplierlist = async (req, res) => {
  try {
   const suppliers = await Supplier.find({ status: "approved" });

    return res.json(suppliers)
  } catch (err) {
    console.log('cannot fetch supplierlist')
  }
}
const getPendingSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ status: "pending" }); 
    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching pending suppliers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Approve Supplier
const approveSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier approved successfully", supplier });
  } catch (error) {
    console.error("Error approving supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reject Supplier
const rejectSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier rejected successfully", supplier });
  } catch (error) {
    console.error("Error rejecting supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const approveSupplierDetails = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    if (supplier.pendingDetails) {
      supplier.district = supplier.pendingDetails.district;
      supplier.place = supplier.pendingDetails.place;
      supplier.pendingDetails = undefined;
      await supplier.save();
    }

    res.json({ message: "Supplier details approved successfully." });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectSupplierDetails = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    supplier.pendingDetails = undefined;
    await supplier.save();

    res.json({ message: "Supplier details update rejected." });
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingUpdates = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      pendingDetails: { $exists: true, $ne: null }
    });

    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching pending updates:", error);
    res.status(500).json({ message: "Server error" });
  }
};const blocksupplier = async (req, res) => {
  try {
    const { email } = req.params;

    // Find supplier by email
    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(404).json({ message: 'No supplier found' });
    }

    // Update status to pending
    supplier.status = 'pending';
    supplier.pendingDetails=undefined
    await supplier.save();

    return res.status(200).json({ message: 'Supplier has been blocked', supplier });
  } catch (error) {
    console.error('Block supplier error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  registerAdmin,
  verifyOTP,
  loginAdmin,
  ChangePassword,
  addimage,
  removeProfileImage,
  Userlist,
  Supplierlist,
  getPendingSuppliers,
  approveSupplier,
  rejectSupplier,
  approveSupplierDetails,rejectSupplierDetails,getPendingUpdates,blocksupplier
};
