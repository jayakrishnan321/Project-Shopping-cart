
const Product = require("../models/Product");
const path = require("path");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const product = new Product({
      name,
      description,
      price,
      category,
      image: imagePath,
    });

    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
const geteditproduct=async(req,res)=>{
  const {id}=req.params;
  try{
      const editproduct=await Product.findById(id)
      if(!editproduct){
        return res.status(404).json({message:'product not found'})
      }
      res.json(editproduct)
  }catch(err){
         console.log(err)
  }
}
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    if (image) product.image = image;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};





module.exports = { addProduct, getAllProducts,deleteProductById,geteditproduct,editProduct };
