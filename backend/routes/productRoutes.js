const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts,deleteProductById,geteditproduct,editProduct } = require("../controllers/productController");
const upload = require("../middleware/uploadproduct");


router.post("/", upload.single("image"), addProduct); 
router.get("/", getAllProducts);
router.get("/:id",geteditproduct)
router.put('/edit/:id', upload.single('image'), editProduct);
router.delete("/delete-product/:id", deleteProductById);


module.exports = router;
