import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("image", imageFile); 

    await dispatch(addProduct(data));
    navigate("/admin/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="name" type="text" placeholder="Product Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="description" type="text" placeholder="Description" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="category" type="text" placeholder="Category" onChange={handleChange} required className="w-full p-2 border rounded" />
        
        <input type="file" name="image" onChange={handleImageChange} required className="w-full p-2 border rounded" />
        
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
