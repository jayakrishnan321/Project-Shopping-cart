const express = require('express');
const { registerAdmin, verifyOTP,loginAdmin,ChangePassword,addimage,removeProfileImage } = require('../controllers/adminController');
const upload = require("../middleware/uploadprofile");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginAdmin)
router.post("/changepassword/:email",ChangePassword)
router.post("/upload/:email", upload.single("image"), addimage); 
router.put("/remove-image/:email", removeProfileImage);


module.exports = router; 

