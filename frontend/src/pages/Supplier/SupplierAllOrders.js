import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { suppliercurrentorders } from "../../redux/slices/supplierSlice";

function SupplierAllOrders() {
  const dispatch = useDispatch();
  const { supplierInfo } = useSelector((state) => state.supplier);

  const [orders, setOrders] = useState([]);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white rounded shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">User Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Total Price</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Arrival Date</th>
                <th className="p-2 border">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{order.userEmail}</td>
                  <td className="p-2 border">{order.address}</td>
                  <td className="p-2 border">₹{order.totalPrice}</td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">
                    {new Date(order.arrivalDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {order.items.map((item) => (
                      <div key={item.productId}>
                        {item.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SupplierAllOrders;
