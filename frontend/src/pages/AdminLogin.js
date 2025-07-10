import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
function AdminLogin() {
    const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
      const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      alert(res.data.message);
      sessionStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
     const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Admin Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default AdminLogin
