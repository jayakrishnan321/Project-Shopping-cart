import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { suppliercurrentorders } from '../../redux/slices/supplierSlice';

function SupplierCurrentOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { supplierInfo } = useSelector((state) => state.supplier);

  const [orders, setOrders] = useState([]); // ✅ State for orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await dispatch(
          suppliercurrentorders({
            place: supplierInfo.place,
            district: supplierInfo.district
          })
        ).unwrap();
        setOrders(res); // ✅ Save response to state
        console.log("Fetched Orders:", res);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    if (supplierInfo?.place && supplierInfo?.district) {
      fetchOrders();
    }
  }, [dispatch, supplierInfo.place, supplierInfo.district]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Supplier Current Orders</h1>
      {orders.length === 0 ? (
        <p>No current orders.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-center">User Email</th>
              <th className="p-2 border text-center">Address</th>
              <th className="p-2 border text-center">Total Price</th>
              <th className="p-2 border text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border text-center">{order.userEmail}</td>
                <td className="p-2 border text-center">{order.address}</td>
                <td className="p-2 border text-center">{order.totalPrice}</td>
                <td className="p-2 border text-center">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupplierCurrentOrders;
