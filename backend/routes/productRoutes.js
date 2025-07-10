const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts } = require("../controllers/productController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), addProduct); 
router.get("/", getAllProducts);

module.exports = router;
