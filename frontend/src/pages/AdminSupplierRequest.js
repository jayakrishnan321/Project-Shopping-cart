import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingUpdates,
  approveUpdate,
  rejectUpdate,
} from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function AdminSupplierRequest() {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { pendingUpdates, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchPendingUpdates());
  }, [dispatch]);

  const handleApprove = (id) => {
    if (window.confirm("Approve this supplier update?")) {
      dispatch(approveUpdate(id)).then(() => {
        alert("Supplier details approved!");
      });
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this supplier update?")) {
      dispatch(rejectUpdate(id)).then(() => {
        alert("Supplier details rejected!");
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Pending Supplier Place/District Updates
      </h1>
      <button
        onClick={() => navigate(-1)}
        className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>
      {loading && <p className="text-blue-500">Loading requests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {pendingUpdates && pendingUpdates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white rounded shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Current District</th>
                <th className="p-2 border">Current Place</th>
                <th className="p-2 border">Requested District</th>
                <th className="p-2 border">Requested Place</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUpdates.map((supplier) => (
                <tr key={supplier._id} className="text-center">
                  <td className="p-2 border">{supplier.name}</td>
                  <td className="p-2 border">{supplier.email}</td>
                  <td className="p-2 border">{supplier.district || "None"}</td>
                  <td className="p-2 border">{supplier.place || "None"}</td>
                  <td className="p-2 border">
                    {supplier.pendingDetails?.district || "—"}
                  </td>
                  <td className="p-2 border">
                    {supplier.pendingDetails?.place || "—"}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleApprove(supplier._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(supplier._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-2"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No pending supplier updates.</p>
      )}
    </div>
  );
}

export default AdminSupplierRequest;
