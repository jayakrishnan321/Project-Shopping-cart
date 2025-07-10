import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRegister from './pages/AdminRegister';
import OTPVerify from './pages/OTPVerify';
import AdminLogin from './pages/AdminLogin';
import Admindashboard from './pages/Admindashboard';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/verify-otp" element={<OTPVerify />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/admin/add-product" element={<AddProduct/>} />

      </Routes>
    </Router>
  );
}

export default App;
