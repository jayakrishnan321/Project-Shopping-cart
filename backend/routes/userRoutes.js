const express = require('express');
const {registerUser,verifyOTP,loginUser,ChangePassword,addimage,removeProfileImage}=require('../controllers/userControllers')
const upload = require("../middleware/uploadprofile");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginUser)
router.post("/changepassword/:email",ChangePassword)
router.post("/upload/:email", upload.single("image"), addimage); 
router.put("/remove-image/:email", removeProfileImage);

module.exports = router; 