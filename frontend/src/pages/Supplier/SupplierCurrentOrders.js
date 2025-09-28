import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { suppliercurrentorders, sendOrderOTP, verifyOrderOTP, sendsuccesmessage, fetchplaceanddistrict } from '../../redux/slices/supplierSlice';
import { useNavigate } from 'react-router-dom';

function SupplierCurrentOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { supplierInfo } = useSelector((state) => state.supplier);

  const [district, setDistrict] = useState("");
  const [place, setPlace] = useState("");
  const [orders, setOrders] = useState([]);

  // 1️⃣ Fetch place and district once supplierInfo is available
  useEffect(() => {
    if (!supplierInfo) return;

    const fetchLocation = async () => {
      try {
        const res = await dispatch(fetchplaceanddistrict({ email: supplierInfo.email })).unwrap();
        setPlace(res.place);
        setDistrict(res.district);
      } catch (err) {
        console.error("Failed to fetch place/district:", err);
      }
    };

    fetchLocation();
  }, [supplierInfo, dispatch]);

  // 2️⃣ Fetch orders only after place and district are set
  useEffect(() => {
    if (!place || !district) return;

    const fetchOrders = async () => {
      try {
        const res = await dispatch(suppliercurrentorders({ place, district })).unwrap();
        setOrders(res);
        console.log("Fetched Orders:", res);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [place, district, dispatch]);

  // 3️⃣ Deliver order function
  const handleDeliver = async (id) => {
    console.log("button pressed")
    console.log('hello')
    try {
      await dispatch(sendOrderOTP(id)).unwrap();
      const otp = prompt("Enter the OTP sent to the user's email:");
      if (otp) {
        await dispatch(verifyOrderOTP({ id, otp })).unwrap();
        alert("Order marked as Delivered!");
        await dispatch(sendsuccesmessage({ id })).unwrap();
        // Refresh orders
        const res = await dispatch(suppliercurrentorders({ place, district })).unwrap();
        setOrders(res);
      }
    } catch (error) {
      alert(error || "Failed to deliver order");
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Supplier Current Orders</h1>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>

      {orders.length === 0 ? (
        <p>No current orders.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-center">User Email</th>
              <th className="p-2 border text-center">Address</th>
              <th className="p-2 border text-center">Total Price</th>
              <th className='p-2 border text-center'>arrivalDate</th>
              <th className="p-2 border text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border text-center">{order.userEmail}</td>
                <td className="p-2 border text-center">{order.address}</td>
                <td className="p-2 border text-center">{order.totalPrice}</td>
                <td className="p-2 border text-center">{new Date(order.arrivalDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}</td>
                <td className="p-2 border text-center">
                  {order.status === "Processing" ? (
                    <button
                      onClick={() => handleDeliver(order._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Deliver
                    </button>
                  ) : (
                    order.status
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupplierCurrentOrders;
