import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id}=useParams()

  const { userInfo } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const buyNowItem = location.state?.buyNowItem; // If coming from Buy Now

  const [houseName, setHouseName] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  // ✅ Correct total calculation
  const totalPrice = buyNowItem
    ? Number(buyNowItem.productId.price || 0) * Number(buyNowItem.quantity || 1)
    : items.reduce(
      (acc, item) => acc + Number(item.productId.price) * Number(item.quantity),
      0
    );const handlePayment = async () => {
  if (!houseName || !postOffice || !city || !district || !pincode) {
    alert("Please fill all address details");
    return;
  }

  const fullAddress = `${houseName}, ${postOffice}, ${city}, ${district}, ${pincode}`;

  // **Check supplier availability first**
  try {
   const res = await api.get(`/supplier/check/${district}/${city}`);


    if (!res.data.success) {
      alert(res.data.message || "No supplier available in your area");
      return; // Stop payment
    }
  } catch (err) {
    alert("Delivery not available for your address");
    return;
  }

  const amountInPaise = totalPrice * 100;

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: "INR",
    name: "Shopping Payment",
    description: "Order Payment",
    handler: async function (response) {
      const orderData = {
        userEmail: userInfo.email,
        items: buyNowItem ? [buyNowItem] : items,
        address: fullAddress,
        totalPrice,
        paymentId: response.razorpay_payment_id,
      };

      try {
        await fetch("http://localhost:5000/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(orderData),
        });
        await axios.delete(`http://localhost:5000/api/cart/delete/${id}`);
        alert("Payment Successful! Your order has been placed.");
        navigate("/user/orders");
      } catch (err) {
        console.error(err);
        alert("Order saving failed");
      }
    },
    prefill: {
      name: userInfo.name,
      email: userInfo.email,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate("/user/login");
    }
  }, [userInfo, navigate]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
 
      {/* Address Fields */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">House Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
          placeholder="Enter house name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Post Office</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={postOffice}
          onChange={(e) => setPostOffice(e.target.value)}
          placeholder="Enter post office"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">City</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">District</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Enter district"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Pincode</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />
      </div>

      {/* Total Price */}
      <div className="text-lg font-semibold mb-4">
        Total Price: ₹ <span className="text-green-600">{totalPrice}</span>
      </div>

      <button
        onClick={handlePayment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
      >
        Pay Now
      </button>
       <button
        onClick={() => navigate(-1)}
        className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>
    </div>
  );
};

export default Checkout;
