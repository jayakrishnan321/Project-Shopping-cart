import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../redux/slices/productSlice";
import { logoutAdmin } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Admindashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.product);
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!adminInfo || !adminInfo.token) {
      navigate('/admin/login');
    } else {
      try {
        dispatch(getProducts());
      } catch (err) {
        console.error("Error fetching products:", err);
        navigate('/admin/login');
      }
    }
  }, [adminInfo, dispatch, navigate]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };
  return (
   <div className="p-4 relative">
  {/* Top Row */}
  <div className="flex justify-between items-center mb-6 relative">
    
    {/* Centered Heading */}
    <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2">
      All Products
    </h1>

    {/* Admin Name & Dropdown */}
    {adminInfo && (
      <div className="relative ml-auto">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {adminInfo.name}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/admin/change-password");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}

        <div className="mt-3">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Products Grid */}
  {loading ? (
    <p>Loading...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {items.map((prod) => (
        <div
          key={prod._id}
          className="border-[3px] border-black p-4 shadow"
        >
          <img
            src={`http://localhost:5000${prod.image}`}
            alt={prod.name}
            className="w-full h-44 object-contain bg-gray-100 rounded"
          />
          <h2 className="text-base font-semibold mt-2">{prod.name}</h2>
          <p className="text-sm text-gray-700">{prod.description}</p>
          <p className="text-green-600 font-bold text-sm">₹ {prod.price}</p>
          <p className="text-xs text-gray-500">Category: {prod.category}</p>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Admindashboard;
