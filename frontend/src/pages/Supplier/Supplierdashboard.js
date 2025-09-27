import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from "../../redux/slices/productSlice";
import { addprofile, removeProfile, setSupplierInfo, clearSupplierInfo,fetchplaceanddistrict } from '../../redux/slices/supplierSlice';
function Supplierdashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [imageFile, setImageFile] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { items, loading } = useSelector((state) => state.product);
  const { supplierInfo } = useSelector((state) => state.supplier);
  const [district,setDistrict]=useState('')
  const [place,setPlace]=useState('')
 
 useEffect(() => {
    if (!supplierInfo || !supplierInfo.token) {
      navigate('/supplier/login');
    } else {
      try {
        dispatch(getProducts());
        dispatch(fetchplaceanddistrict({ email: supplierInfo.email }))
      .unwrap()
      .then((res) => {
        
        setPlace(res.place)
        setDistrict(res.district)
    
      })
      } catch (err) {
        console.error("Error fetching products:", err);
        navigate('/supplier/login');
      }
    }
  }, [supplierInfo, dispatch, navigate]);  


  const handleChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleRemoveImage = async () => {
    if (window.confirm("Are you sure you want to remove the profile image?")) {
      try {
        const result = await dispatch(removeProfile(supplierInfo.email)).unwrap();
        alert(result.message);

        // ✅ Update Redux and session storage
        dispatch(setSupplierInfo({
          ...supplierInfo,
          image: "", // clear image from state
        }));
      } catch (err) {
        alert("Failed to remove profile image");
        console.error(err);
      }
    }
  };
  const handleAddimage = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    const data = new FormData();
    data.append("image", imageFile);
    try {
      const result = await dispatch(addprofile({ data, email: supplierInfo.email })).unwrap();

      alert(result.message);

      // ✅ Update Redux with new image + keep old token
      dispatch(setSupplierInfo({
        ...supplierInfo,
        image: result.supplier.image,
      }));

      setImageFile(null); // optional reset
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    }
  };
  const handleLogout = () => {
    dispatch(clearSupplierInfo());
    navigate("/supplier/login");
  };
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-800 text-white px-6 py-4 rounded-md mb-6 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        {/* Left Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left">
            Supplier Dashboard
          </h1>

          {/* Buttons Group */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <button
              onClick={() => navigate("/supplier/dashboard")}
              className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
              All Products
            </button>
            <button
              onClick={() => navigate("/supplier/allorders")}
              className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
              All Orders
            </button>
            <button
              onClick={() => navigate("/supplier/currentorders")}
              className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
              Current Orders
            </button>
            <button
              onClick={() => navigate("/supplier/addplacedetails")}
              className="text-sm bg-white text-blue-800 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
              {(place&&district)?"Update place Details":"Add Place Details"}
            
            </button>
          </div>
        </div>

        {/* Right Section - Profile */}
        {supplierInfo && (
          <div className="relative text-center sm:text-right">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-100 transition w-full sm:w-auto"
            >
              {supplierInfo.name}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-20 text-black">
                <div className="flex flex-col items-center p-3 relative group">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${supplierInfo.image}`}
                    alt="No Profile"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <button
                    onClick={() => document.getElementById("profileImageInput").click()}
                    className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                    title={supplierInfo?.image ? "Update Profile Picture" : "Add Profile Picture"}
                  >
                    {supplierInfo?.image ? "🖊️" : "➕"}
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
                  {supplierInfo?.image ? "Update Image" : "Add Image"}
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/supplier/change-password");
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

      {/* Products Grid */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((prod) => (
            <div
              key={prod._id}
              className="border-2 border-gray-300 bg-white p-4 shadow rounded-lg transition hover:shadow-lg"
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${prod.image}`}
                alt={prod.name}
                className="w-full h-44 object-contain bg-gray-100 rounded"
              />
              <h2 className="text-base font-semibold mt-2">{prod.name}</h2>
              <p className="text-sm text-gray-700 line-clamp-2">{prod.description}</p>
              <p className="text-green-600 font-bold text-sm mt-1">₹ {prod.price}</p>
              <p className="text-xs text-gray-500">Category: {prod.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>

  )
}

export default Supplierdashboard
