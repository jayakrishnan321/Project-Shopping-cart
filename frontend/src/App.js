import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import OTPVerify from './pages/OTPVerify';
import Login from './pages/Login';
import Admindashboard from './pages/Admindashboard';
import AddProduct from './pages/AddProduct';
import ChangePasswordcomponent from './pages/ChangePassword';
import AdminEditProduct from './pages/AdminEditProduct';
import Userdashboard from './pages/Userdashboard';
import Userlist from './pages/Userlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserOrders from './pages/UserOrders';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<Register role="admin" />} />
        <Route path="/admin/verify-otp" element={<OTPVerify role='admin' />} />
        <Route path='/admin/login' element={<Login  role='admin'/>} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/admin/add-product" element={<AddProduct/>} />
        <Route path='/admin/change-password' element={<ChangePasswordcomponent role="admin"/>}/>
        <Route path='/admin/edit-product/:id'  element={<AdminEditProduct/>}/>
        <Route path='/admin/users' element={<Userlist/>}/>
        <Route path='/admin/orders' element={<AdminOrders/>}/>
        <Route path='/' element={<Register role="user"/>}/>
        <Route path='/user/verify-otp' element={<OTPVerify role='user'/>}/>
        <Route path='/user/login' element={<Login role='user' />} />
        <Route path='/user/dashboard' element={<Userdashboard/>}/>
        <Route path="/user/change-password" element={<ChangePasswordcomponent role="user" />} />
        <Route path='/user/cart' element={<Cart/>}/>
        <Route path='/user/checkout' element={<Checkout/>}/>
        <Route path='/user/orders' element={<UserOrders/>}/>
      </Routes>
    </Router>
  );
}

export default App;
