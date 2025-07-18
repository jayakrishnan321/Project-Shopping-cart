const express=require('express')
const router=express.Router()
const {registersupllier,verifyOTP,loginSupplier}=require('../controllers/supplierController')

router.post('/register',registersupllier)
router.post("/verify-otp", verifyOTP);
router.post("/login",loginSupplier)

module.exports = router; 