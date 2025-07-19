import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
        console.log(res.data)
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading orders...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User Email</th>
              <th className="p-2 border">User address</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Arrival Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border text-center">{order._id}</td>
                <td className="p-2 border text-center">{order.userEmail}</td>
                <td className="p-2 border text-center">{order.address}</td>
                <td className="p-2 border text-center">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-center mb-1">
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover"
                      />
                      <div>
                        <p>{item.name}</p>
                        <p>₹ {item.price} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="p-2 border font-bold text-center">₹ {order.totalPrice}</td>
                <td className="p-2 border text-center">{order.status}</td>
                <td className="p-2 border text-center">
                  {order.arrivalDate
                    ? new Date(order.arrivalDate).toDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
