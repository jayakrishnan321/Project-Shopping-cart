const express = require('express');
const { registerAdmin, verifyOTP,loginAdmin,ChangePassword } = require('../controllers/adminController');


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginAdmin)
router.post("/changepassword/:email",ChangePassword)

module.exports = router; 

