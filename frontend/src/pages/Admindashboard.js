import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts, deleteProduct } from "../redux/slices/productSlice";
import { logoutAdmin, addprofile, setAdminInfo, removeProfile } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Admindashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { items, loading } = useSelector((state) => state.product);
  const { adminInfo } = useSelector((state) => state.auth);
console.log(adminInfo)
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


  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap(); // You should create this thunk
        alert("Product deleted");
        dispatch(getProducts());
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddimage = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    const data = new FormData();
    data.append("image", imageFile);
    try {
      const result = await dispatch(addprofile({ data, email: adminInfo.email })).unwrap();

      alert(result.message);

      // ✅ Update Redux with new image + keep old token
      dispatch(setAdminInfo({
        ...adminInfo,
        image: result.admin.image,
      }));

      setImageFile(null); // optional reset
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    }
  };

  const handleRemoveImage = async () => {
    if (window.confirm("Are you sure you want to remove the profile image?")) {
      try {
        const result = await dispatch(removeProfile(adminInfo.email)).unwrap();
        alert(result.message);

        // ✅ Update Redux and session storage
        dispatch(setAdminInfo({
          ...adminInfo,
          image: "", // clear image from state
        }));
      } catch (err) {
        alert("Failed to remove profile image");
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
  <div className="bg-blue-800 text-white px-6 py-4 rounded-md mb-6 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
    
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <h1 className="text-2xl font-bold tracking-wide">Admin Dashboard</h1>
      <div className="flex gap-2 mt-1 sm:mt-0">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All Products
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All Users
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All Orders
        </button>
          <button
          onClick={() => navigate("/admin/suppliers")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All Suppliers
        </button>
          <button
          onClick={() => navigate("/admin/pendingsuppliers")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All Request
        </button>
        <button
          onClick={() => navigate("/admin/supplierrequest")}
          className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          All supplier Request
        </button>
      </div>
    </div>

    {/* Right: Profile & Add Product */}
    {adminInfo && (
      <div className="relative text-right">
        {/* Profile Dropdown Trigger */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          {adminInfo.name}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-20 text-black">
            <div className="flex flex-col items-center p-3 relative group">
              <img
                src={`http://localhost:5000${adminInfo.image}`}
                alt="No Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <button
                onClick={() => document.getElementById("profileImageInput").click()}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                title={adminInfo?.image ? "Update Profile Picture" : "Add Profile Picture"}
              >
                {adminInfo?.image ? "🖊️" : "➕"}
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
              <span className="text-sm text-gray-600 mt-2">Current Image</span>
            </div>
            <button
              onClick={() => handleAddimage()}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {adminInfo?.image ? "Update Image" : "Add Image"}
            </button>
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

        {/* Add Product Button */}
        <div className="mt-3">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            ➕ Add Product
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Products Grid */}
  {loading ? (
    <p className="text-center text-gray-600 text-lg">Loading products...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((prod) => (
        <div
          key={prod._id}
          className="border-[2px] border-gray-300 bg-white p-4 shadow rounded-lg transition hover:shadow-lg"
        >
          <img
            src={`http://localhost:5000${prod.image}`}
            alt={prod.name}
            className="w-full h-44 object-contain bg-gray-100 rounded"
          />
          <h2 className="text-base font-semibold mt-2">{prod.name}</h2>
          <p className="text-sm text-gray-700 line-clamp-2">{prod.description}</p>
          <p className="text-green-600 font-bold text-sm mt-1">₹ {prod.price}</p>
          <p className="text-xs text-gray-500">Category: {prod.category}</p>

          <div className="mt-3 flex justify-between gap-2">
            <button
              onClick={() => handleEdit(prod._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleRemove(prod._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Admindashboard;
