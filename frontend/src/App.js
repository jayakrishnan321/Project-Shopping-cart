import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRegister from './pages/AdminRegister';
import OTPVerify from './pages/OTPVerify';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/verify-otp" element={<OTPVerify />} />
        <Route path='/admin/login' element={<AdminLogin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
