import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from "../redux/slices/productSlice";
import { clearUserInfo } from '../redux/slices/userSlice';
import { addprofile,removeProfile,setUserInfo } from '../redux/slices/userSlice';

function Userdashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null)
    const { items, loading } = useSelector((state) => state.product);
    const { userInfo } = useSelector((state) => state.user);
    console.log(userInfo)
    useEffect(() => {
        if (!userInfo || !userInfo.token) {
            navigate('/user/login');
        } else {
            try {
                dispatch(getProducts());
            } catch (err) {
                console.error("Error fetching products:", err);
                navigate('/user/login');
            }
        }
    }, [userInfo, dispatch, navigate]);
    const handleChange = (e) => {
        setImageFile(e.target.files[0]);
    };
    const handleLogout = () => {
        dispatch(clearUserInfo());
        navigate("/admin/login");
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

            dispatch(setUserInfo({
                ...userInfo,
                image: result.user.image,
            }));

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

                // ✅ Update Redux and session storage
                dispatch(setUserInfo({
                    ...userInfo,
                    image: "", // clear image from state
                }));
            } catch (err) {
                alert("Failed to remove profile image");
                console.error(err);
            }
        }
    };
    return (
        <div className="p-4 relative">
            <div className="flex justify-between items-center mb-6 relative">
                <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2">
                    All Products
                </h1>
                {userInfo && (
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {userInfo.name}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                                <div className="flex flex-col items-center p-2 relative group">
                                    <img
                                        src={`http://localhost:5000${userInfo.image}`}
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

    )
}

export default Userdashboard
