import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Register = ({role}) => {
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
  const isAdmin = role === 'admin';
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const endpoint = isAdmin ? '/admin/register' : '/user/register';
    const verifyRoute = isAdmin ? '/admin/verify-otp' : '/user/verify-otp';

    const res = await API.post(endpoint, form);
    setMessage(res.data.message);
    
    sessionStorage.setItem(isAdmin ? 'pendingAdminEmail' : 'pendingUserEmail', form.email);
    navigate(verifyRoute);
  } catch (err) {
    setMessage(err.response?.data?.message || 'Error registering');
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        
       { isAdmin?<h2 className="text-2xl font-bold text-center">Admin Register</h2>
        :<h2 className="text-2xl font-bold text-center">User Register</h2>
       }
        {['name', 'email', 'phone', 'password', 'confirmPassword', ...(isAdmin ? ['secretKey'] : [])].map((field) => (
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
       <div className="mt-4 text-center">
  <p className="text-sm text-gray-600">
    Already have an account?{" "}
    <a
      href={isAdmin ? "/admin/login" : "/user/login"}
      className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors"
    >
      Log in
    </a>
  </p>
</div>

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Register</button>

        {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
