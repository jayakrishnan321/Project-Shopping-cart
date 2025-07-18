import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supplierlist } from "../redux/slices/authSlice" // adjust path

function Supplierlist() {
  const dispatch = useDispatch();
  const { suppliers, loading, error, adminInfo } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (adminInfo) {
      dispatch(supplierlist());
    }
  }, [dispatch, adminInfo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers List</h1>

      {loading && <p className="text-blue-500">Loading suppliers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {suppliers && suppliers.length > 0 ? (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="text-center">
                <td className="p-2 border">{supplier.name}</td>
                <td className="p-2 border">{supplier.email}</td>
                <td className="p-2 border">{supplier.phone}</td>
                <td className="p-2 border font-semibold">
                  {supplier.status}
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
