const express = require('express');
const { registerAdmin, verifyOTP,loginAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginAdmin)

module.exports = router; 

