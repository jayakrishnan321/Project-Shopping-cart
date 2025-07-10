import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const OTPVerify = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('pendingAdminEmail') || '';
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/verify-otp', { email, otp });
      setMessage(res.data.message);
      localStorage.removeItem('pendingAdminEmail');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">Verify</button>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default OTPVerify;
