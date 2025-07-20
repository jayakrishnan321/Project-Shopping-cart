const express = require('express')
const router = express.Router()
const { registersupllier,
    verifyOTP,
    loginSupplier,
    addimage,
    removeProfileImage,
    ChangePassword,
    updateplaceanddistrict,
    fetchcurrentorders,
    sendOrderOTP,
    verifyOrderOTP,
    checkSupplierAvailability,
    sendsuccesmessage
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
router.post("/:id/send-otp", sendOrderOTP);
router.put("/:id/verify-otp", verifyOrderOTP);
router.get("/check/:district/:place", checkSupplierAvailability);
router.post("/successmessage/:id",sendsuccesmessage)

module.exports = router; 