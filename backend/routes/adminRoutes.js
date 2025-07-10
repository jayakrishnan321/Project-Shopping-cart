const express = require('express');
const { registerAdmin, verifyOTP } = require('../controllers/adminController');

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-otp", verifyOTP);

module.exports = router; 

