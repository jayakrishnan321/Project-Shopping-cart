const express = require('express');
const {registerUser,verifyOTP,loginUser}=require('../controllers/userControllers')

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginUser)

module.exports = router; 