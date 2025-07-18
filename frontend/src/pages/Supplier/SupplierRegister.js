import React, { useState } from 'react'
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSupplierInfo } from '../../redux/slices/supplierSlice';


function SupplierRegister() {
  const dispatch=useDispatch()
   const navigate=useNavigate()
 const [error, setError] = useState("");
const [formData, setformData] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

    const handleChange=(e)=>{
        const {name,value}=e.target
        setformData({...formData,[name]:value})
    }
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  setError("");

  try {
    const res = await API.post("/supplier/register", formData);
    dispatch(setSupplierInfo({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    }));
    sessionStorage.setItem("pendingSupplierEmail", formData.email);
    alert(res.data.message);
    navigate("/supplier/verify-otp");
  } catch (err) {
    if (err.response && err.response.data.message) {
      alert(err.response.data.message); // ✅ Shows "Email already exists"
    } else {
      alert("Something went wrong. Try again later.");
    }
  }
};

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

     
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default SupplierRegister
