import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supplierallorders,fetchplaceanddistrict } from "../../redux/slices/supplierSlice";
import { useNavigate } from "react-router-dom";

function SupplierAllOrders() {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { supplierInfo } = useSelector((state) => state.supplier);
  const [orders, setOrders] = useState([]);
  const [district,setDistrict]=useState('')
    const [place,setPlace]=useState('')
    
  useEffect(() => {
      if (!supplierInfo || !supplierInfo.token) {
        navigate('/supplier/login');
      } else {
        try {
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


  const fetchOrders = useCallback(async () => {
    try {
      const res = await dispatch(
        supplierallorders({
          place:place,
          district:district,
        })
      ).unwrap();
      setOrders(res);
      console.log(res)
      console.log("Fetched Orders:", res);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, [dispatch, place,district]);

  useEffect(() => {
    if (place && district) {
      fetchOrders();
    }
  }, [fetchOrders, place,district]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">All Orders</h1>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>


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
