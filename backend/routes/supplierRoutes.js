const express = require('express')
const router = express.Router()
const { registersupllier,
    verifyOTP,
    loginSupplier,
    addimage,
    removeProfileImage,
    ChangePassword,
    updateplaceanddistrict,
    fetchcurrentorders
} = require('../controllers/supplierController')
const upload = require("../middleware/uploadprofile");

router.post('/register', registersupllier)
router.post("/verify-otp", verifyOTP);
router.post("/login", loginSupplier)
router.post("/upload/:email", upload.single("image"), addimage);
router.put("/remove-image/:email", removeProfileImage);
router.post("/changepassword/:email", ChangePassword)
router.put('/update-details/:email', updateplaceanddistrict)
router.get('/currentorders/:district/:place',fetchcurrentorders)
module.exports = router; 