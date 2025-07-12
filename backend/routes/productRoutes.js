const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts,deleteProductById } = require("../controllers/productController");
const upload = require("../middleware/uploadproduct");


router.post("/", upload.single("image"), addProduct); 
router.get("/", getAllProducts);
router.delete("/delete-product/:id", deleteProductById);


module.exports = router;
