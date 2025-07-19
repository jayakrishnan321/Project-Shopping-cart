const express = require('express');

const { registerAdmin,
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
   approveSupplierDetails,
   rejectSupplierDetails,
   getPendingUpdates
} = require('../controllers/adminController');

const upload = require("../middleware/uploadprofile");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginAdmin)

router.post("/changepassword/:email", ChangePassword)
router.post("/upload/:email", upload.single("image"), addimage);
router.put("/remove-image/:email", removeProfileImage);

router.get("/userlist", Userlist)
router.get("/supplierlist", Supplierlist)

router.get("/pending-registrations", getPendingSuppliers);
router.put("/approve-registration/:id", approveSupplier);
router.put("/reject-registration/:id", rejectSupplier);

router.get("/pending-updates", getPendingUpdates);
router.put("/approve-update/:id", approveSupplierDetails);
router.put("/reject-update/:id", rejectSupplierDetails);

module.exports = router;

