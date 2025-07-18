import { useState } from 'react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { useSelector } from "react-redux";
function SupplierOtpVerify() {
    const supplierInfo = useSelector((state) => state.supplier.supplierInfo);
     const navigate = useNavigate();
     const email=sessionStorage.getItem('pendingSupplierEmail')
       const [otp, setOtp] = useState('');
       const [message, setMessage] = useState('');
 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  console.log(email)
      const res = await API.post('/supplier/verify-otp', {
        name:supplierInfo.name,
        password:supplierInfo.password,
        phone:supplierInfo.phone,
        email, 
        otp });
      setMessage(res.data.message);

      sessionStorage.removeItem('pendingSupplierEmail');

      setTimeout(() => navigate('/supplier/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };
     
     
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold text-center">
           OTP Verification
        </h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Verify
        </button>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  )
}

export default SupplierOtpVerify
