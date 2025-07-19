import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSupplierInfo } from '../../redux/slices/supplierSlice'; 
import { jwtDecode } from 'jwt-decode';
import API from '../../api';

function SupplierLogin() {
              const navigate = useNavigate();
               const dispatch = useDispatch();
             
               const [form, setForm] = useState({
                 email: '',
                 password: '',
               });
             
              const handleLogin = async () => {
               if (!form.email || !form.password) {
                 alert('Please fill all fields');
                 return;
               }
             
               try {
               
                 const res = await API.post('/supplier/login',form)
                 alert(res.data.message);
             
                 const token = res.data.token;
                 sessionStorage.setItem('token', token);
                 const decoded = jwtDecode(token);
             
                 
                   dispatch(setSupplierInfo({
                     name: decoded.name,
                     email: decoded.email,
                     image: decoded.image,
                     token: token,
                     place:decoded.place,
                     district:decoded.district
                   }))
             
               
                 navigate('/supplier/dashboard')
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
        Supplier Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="supplier email"
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

export default SupplierLogin
