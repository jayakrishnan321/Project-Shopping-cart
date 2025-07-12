import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts, deleteProduct } from "../redux/slices/productSlice";
import { logoutAdmin, addprofile,setAdminInfo } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Admindashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null)
  const { items, loading } = useSelector((state) => state.product);
  const { adminInfo } = useSelector((state) => state.auth);
  console.log(adminInfo.image)

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
                {/* Admin Profile Image Preview */}
                {adminInfo?.image && (
                  <div className="flex flex-col items-center p-2">
                    <img
                      src={`http://localhost:5000${adminInfo.image}`}
                      alt="Admin"
                      className="w-20 h-20 rounded-full object-cover border mb-2"
                    />
                    <span className="text-sm text-gray-600">Current Image</span>
                  </div>
                )}

                {/* Image Upload Input */}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-1 border border-black rounded-md mt-1"
                />

                {/* Upload Button (label changes based on image existence) */}
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

              {/* ✅ Buttons */}
              <div className="mt-3 flex justify-between gap-2">
                <button
                  onClick={() => handleEdit(prod._id)} // implement this
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(prod._id)} // implement this
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
