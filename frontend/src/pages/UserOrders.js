import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserOrders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`http://localhost:5000/api/orders/user/${userInfo.email}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Arriving by: {new Date(order.arrivalDate).toDateString()}</p>
              <div>
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 mt-2">
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <p>{item.name}</p>
                      <p>₹ {item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-bold mt-2">Total: ₹ {order.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
