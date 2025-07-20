import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { suppliercurrentorders, sendOrderOTP, verifyOrderOTP, sendsuccesmessage } from '../../redux/slices/supplierSlice';
import { useNavigate } from 'react-router-dom';

function SupplierCurrentOrders() {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { supplierInfo } = useSelector((state) => state.supplier);
  const [orders, setOrders] = useState([]); // ✅ State for orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await dispatch(
        suppliercurrentorders({
          place: supplierInfo.place,
          district: supplierInfo.district,
        })
      ).unwrap();
      setOrders(res);
      console.log("Fetched Orders:", res);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, [dispatch, supplierInfo.place, supplierInfo.district]);
  useEffect(() => {
    if (supplierInfo?.place && supplierInfo?.district) {
      fetchOrders();
    }
  }, [fetchOrders, supplierInfo.place, supplierInfo.district]);

  const handleDeliver = async (id) => {
    try {
      await dispatch(sendOrderOTP(id)).unwrap(); // Step 1: Send OTP
      const otp = prompt("Enter the OTP sent to the user's email:");

      if (otp) {
        await dispatch(verifyOrderOTP({ id, otp })).unwrap(); // Step 2: Verify OTP
        alert("Order marked as Delivered!");
        await dispatch(sendsuccesmessage({ id })).unwrap();
        await fetchOrders(); // ✅ Re-fetch orders after status update
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
