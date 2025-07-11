import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";

const Admindashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.product);
  const { adminInfo } = useSelector((state) => state.auth); 
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Profile Button */}
        {adminInfo && (
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {adminInfo.name}
            </button>
          </div>
        )}
       {adminInfo&&
        (adminInfo.name)&&
             <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
        
        
       }
        
      </div>

      <h1 className="text-2xl font-semibold mb-4">All Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {items.map((prod) => (
            <div
              key={prod._id}
              className="border-[3px] border-black p-4 shadow "
            >
              <img
                src={`http://localhost:5000${prod.image}`}
                alt={prod.name}
                className="w-full h-44 object-contain bg-gray-100 rounded"
              />
              <h2 className="text-base font-semibold mt-2">{prod.name}</h2>
              <p className="text-sm text-gray-700">{prod.description}</p>
              <p className="text-green-600 font-bold text-sm">₹ {prod.price}</p>
              <p className="text-xs text-gray-500">Category: {prod.category}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Admindashboard;
