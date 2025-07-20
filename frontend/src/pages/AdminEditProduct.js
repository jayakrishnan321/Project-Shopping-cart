import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { geteditproduct, editproduct } from '../redux/slices/productSlice';

function AdminEditProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminInfo } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
    });
    const [prevImage, setPrevImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!adminInfo) {
                navigate('/admin/login');
            } else {
                try {
                    const res = await dispatch(geteditproduct(id)).unwrap();
                    setFormData({
                        name: res.name,
                        description: res.description,
                        price: res.price,
                        category: res.category,
                        image: null,
                    });
                    setPrevImage(res.image);
                } catch (err) {
                    console.log(err);
                    navigate('/admin/login');
                }
            }
        };
        fetchProduct();
    }, [adminInfo, dispatch, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleUpdate = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        dispatch(editproduct({ id, data: formDataToSend }));

        console.log('Form Data:', formData);
        alert('Updated');
        navigate("/admin/dashboard")
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-5 shadow rounded border">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

            <label className="block mb-2">Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2">Description:</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-4 rounded"
            ></textarea>

            <label className="block mb-2">Price:</label>
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2">Category:</label>
            <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2">Current Image:</label>
            {prevImage && (
                <img
                    src={`http://localhost:5000${prevImage}`}
                    alt="Current"
                    className="w-32 h-32 object-cover mb-4"
                />
            )}

            <label className="block mb-2">Change Image:</label>
            <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="mb-4"
            />
            <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Update Product
            </button>
            <button
                onClick={() => navigate(-1)}
                className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
            >
                ← Back
            </button>
        </div>
    );
}

export default AdminEditProduct;
