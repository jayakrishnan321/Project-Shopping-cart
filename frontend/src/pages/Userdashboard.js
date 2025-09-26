import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from "../redux/slices/productSlice";
import { clearUserInfo, addprofile, removeProfile, setUserInfo } from '../redux/slices/userSlice';
import { usercart } from '../redux/slices/cartSlice'; 
function Userdashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { items, loading } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/user/login');
    } else {
      dispatch(getProducts());
    }
  }, [userInfo, dispatch, navigate]);

  const handleChange = (e) => setImageFile(e.target.files[0]);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/user/login");
  };

  const handleAddimage = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    const data = new FormData();
    data.append("image", imageFile);
    try {
      const result = await dispatch(addprofile({ data, email: userInfo.email })).unwrap();
      alert(result.message);
      dispatch(setUserInfo({ ...userInfo, image: result.user.image }));
      setImageFile(null);
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    }
  };

  const handleRemoveImage = async () => {
    if (window.confirm("Are you sure you want to remove the profile image?")) {
      try {
        const result = await dispatch(removeProfile(userInfo.email)).unwrap();
        alert(result.message);
        dispatch(setUserInfo({ ...userInfo, image: "" }));
      } catch (err) {
        alert("Failed to remove profile image");
        console.error(err);
      }
    }
  };
  const AddCart = async (id, email) => {
  try {
    const res = await dispatch(usercart({ id, email })).unwrap();
    alert(res.message); // success message from backend
  } catch (err) {
    alert("Failed to add to cart");
    console.error(err);
  }
};
  return (
   <div className="p-4 relative min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-blue-800 text-white px-4 sm:px-6 py-4 rounded-md mb-6 shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
    
    {/* Left Navigation */}
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 items-center">
      <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left">
        User Dashboard
      </h1>
      <button
        onClick={() => navigate("/user/dashboard")}
        className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
      >
        All Products
      </button>
      <button
        onClick={() => navigate("/user/cart")}
        className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
      >
        Cart
      </button>
      <button
        onClick={() => navigate("/user/orders")}
        className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
      >
        Orders
      </button>
    </div>

    {/* Right Dropdown */}
    {userInfo && (
      <div className="relative w-full sm:w-auto text-center sm:text-right">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-100 transition w-full sm:w-auto"
        >
          {userInfo.name}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10 text-black">
            <div className="flex flex-col items-center p-2 relative group">
              <img
                src={`${process.env.REACT_APP_API_URL}${userInfo.image}`}
                alt="No Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <button
                onClick={() => document.getElementById("profileImageInput").click()}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                title={userInfo?.image ? "Update Profile Picture" : "Add Profile Picture"}
              >
                {userInfo?.image ? "🖊️" : "➕"}
              </button>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute bottom-10 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                title="Remove Profile Picture"
              >
                🗑️
              </button>
              <span className="text-sm text-gray-600 mt-1">Current Image</span>
            </div>
            <button
              onClick={() => handleAddimage()}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {userInfo?.image ? "Update Image" : "Add Image"}
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/user/change-password");
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
      </div>
    )}
  </div>

  {/* Product Display */}
  {loading ? (
    <p className="text-center text-gray-600">Loading...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((prod) => (
        <div
          key={prod._id}
          className="border border-gray-300 p-4 rounded shadow-md hover:shadow-lg transition bg-white"
        >
          <img
            src={`${process.env.REACT_APP_API_URL}${prod.image}`}
            alt={prod.name}
            className="w-full h-44 object-contain bg-gray-100 rounded"
          />
          <h2 className="text-base font-semibold mt-2">{prod.name}</h2>
          <p className="text-sm text-gray-700 line-clamp-2">{prod.description}</p>
          <p className="text-green-600 font-bold text-sm">₹ {prod.price}</p>
          <p className="text-xs text-gray-500 mb-2">Category: {prod.category}</p>

          <button
            onClick={() => AddCart(prod._id, userInfo.email)}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            🛒 Add to Cart
          </button>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

export default Userdashboard;
