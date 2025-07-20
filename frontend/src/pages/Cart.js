import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart,increaseQuantity,decreaseQuantity,removeitemcart } from '../redux/slices/cartSlice'; // you should create this thunk
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);
    const { items, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!userInfo || !userInfo.email) {
            navigate('/user/login');
        } else {
            dispatch(fetchCart(userInfo.email));
        }
    }, [dispatch, userInfo, navigate]);
const handleBuy = (item,id) => {
  navigate(`/user/checkout/${id}`, { state: { buyNowItem: item } });
};

    if (loading) return <p className="text-center mt-6">Loading...</p>;
    if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
const handleIncrease = async (itemId) => {
  try {
    await dispatch(increaseQuantity(itemId)).unwrap();
    dispatch(fetchCart(userInfo.email)); // Refresh cart
  } catch (err) {
    console.error("Error increasing quantity", err);
  }
};

const handleDecrease = async (itemId) => {
  try {
    await dispatch(decreaseQuantity(itemId)).unwrap();
    dispatch(fetchCart(userInfo.email)); // Refresh cart
  } catch (err) {
    console.error("Error decreasing quantity", err);
  }
};
const handleRemove = async (id) => {
  if (!id) {
    alert("Invalid item ID");
    return;
  }

  try {
    await dispatch(removeitemcart({ id })).unwrap();
    alert("Item removed from cart successfully");

    // Refresh cart items
    await dispatch(fetchCart(userInfo.email)); // Assuming you have a fetchCart thunk
  } catch (err) {
    console.error("Remove item failed:", err);
    alert("Failed to remove item from cart");
  }
};


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>
             <button
        onClick={() => navigate(-1)}
        className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>
            {items.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
               <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <div
      key={item._id}
      className="border border-gray-300 rounded-lg p-4 shadow-md"
    >
      <img
        src={`http://localhost:5000${item.productId.image}`}
        alt={item.productId.name}
        className="w-full h-40 object-contain bg-gray-100 rounded mb-3"
      />
      <h3 className="text-lg font-semibold">{item.productId.name}</h3>
      <p className="text-sm text-gray-700 mb-1">{item.productId.description}</p>
      <p className="text-green-600 font-bold">₹ {item.productId.price}</p>

      {/* Quantity Control */}
      <p className="text-sm flex items-center justify-center gap-2 mt-2">
        Quantity:
        <button
          onClick={() => handleDecrease(item._id)}
          className="bg-gray-200 px-2 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => handleIncrease(item._id)}
          className="bg-gray-200 px-2 rounded hover:bg-gray-300"
        >
          +
        </button>
      </p>

      {/* Buy Button */}
      <button
        onClick={() => handleBuy(item, item._id)}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Buy
      </button>

      {/* Remove from Cart Button */}
      <button
        onClick={() => handleRemove(item._id)}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
      >
        Remove
      </button>
    </div>
  ))}
</div>

            )}
        </div>
    );
};

export default Cart;
