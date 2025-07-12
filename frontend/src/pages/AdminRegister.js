import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/admin/register', form);
      setMessage(res.data.message);
      localStorage.setItem('pendingAdminEmail', form.email);
      navigate('/admin/verify-otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Admin Register</h2>

        {['name', 'email', 'phone', 'password', 'confirmPassword', 'secretKey'].map((field) => (
          <input
            key={field}
            type={field.toLowerCase().includes('password') ? 'password' : 'text'}
            name={field}
            placeholder={field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        ))}

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Register</button>

        {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AdminRegister;
