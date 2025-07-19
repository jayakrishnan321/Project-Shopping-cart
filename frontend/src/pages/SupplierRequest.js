import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingRegistrations,
  approveRegistration,
  rejectRegistration,
} from "../redux/slices/authSlice";

function SupplierRequest() {
  const dispatch = useDispatch();
  const { pendingRegistrations, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchPendingRegistrations());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveRegistration(id)).then(() => {
      dispatch(fetchPendingRegistrations()); // Refresh list
    });
  };

  const handleReject = (id) => {
    dispatch(rejectRegistration(id)).then(() => {
      dispatch(fetchPendingRegistrations()); // Refresh list
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Pending Supplier Registrations
      </h1>

      {pendingRegistrations.length === 0 ? (
        <p>No pending supplier registrations</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRegistrations.map((supplier) => (
              <tr key={supplier._id} className="border-b text-center">
                <td className="p-2">{supplier.name}</td>
                <td className="p-2">{supplier.email}</td>
                <td className="p-2">{supplier.phone}</td>
                <td className="p-2">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleApprove(supplier._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(supplier._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupplierRequest;
