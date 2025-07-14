import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAdminInfo } from '../redux/slices/authSlice'; 
import { setUserInfo } from '../redux/slices/userSlice';
import { jwtDecode } from 'jwt-decode';

function Login({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = role === 'admin';

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
    const endpoint = isAdmin ? '/api/admin/login' : '/api/user/login';
    const res = await axios.post(`http://localhost:5000${endpoint}`, form);
    alert(res.data.message);

    const token = res.data.token;
    sessionStorage.setItem('token', token);
    const decoded = jwtDecode(token);

    if (isAdmin) {
      dispatch(setAdminInfo({
        name: decoded.name,
        email: decoded.email,
        image: decoded.image,
        token: token,
      }));
    } else {
      dispatch(setUserInfo({
        name: decoded.name,
        email: decoded.email,
        token: token,
      }));
    }

    const dashboardRoute = isAdmin ? '/admin/dashboard' : '/user/dashboard';
    navigate(dashboardRoute);
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
          {isAdmin ? 'Admin' : 'User'} Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder={isAdmin ? 'Admin Email' : 'User Email'}
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
  );
}

export default Login;
