import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supplierlist,supplierblock } from "../redux/slices/authSlice"

function Supplierlist() {
  const dispatch = useDispatch();
  const { suppliers, loading, error, adminInfo } = useSelector(
    (state) => state.auth
  );
  console.log(suppliers)

  useEffect(() => {
    if (adminInfo) {
      dispatch(supplierlist());
    }
  }, [dispatch, adminInfo]);
  const handleBlock = async (email) => {
  try {
    const res = await dispatch(supplierblock({ email })).unwrap();
    alert(res.message || "Supplier has been blocked successfully");
  } catch (error) {
    alert(error || "Failed to block supplier");
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers List</h1>

      {loading && <p className="text-blue-500">Loading suppliers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {suppliers && suppliers.length > 0 ? (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Profile</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={`http://localhost:5000${supplier.image}`}
                    alt={supplier.name}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="p-2 border">{supplier.name}</td>
                <td className="p-2 border">{supplier.email}</td>
                <td className="p-2 border">{supplier.phone}</td>
                <td className="p-2 border font-semibold">
                  {supplier.status}
                </td>
                <td className="p-2 border text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow-md transition duration-200"
                    onClick={() => handleBlock(supplier.email)}
                  >
                    Block
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>


      ) : (
        !loading && <p>No suppliers found.</p>
      )}
    </div>
  );
}

export default Supplierlist;
