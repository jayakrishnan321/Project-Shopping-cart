import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingSuppliers, approveSupplier, rejectSupplier } from "../redux/slices/authSlice";

function SupplierRequest() {
    const dispatch = useDispatch();
    const { pendingSuppliers, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchPendingSuppliers());
    }, [dispatch]);

    const handleApprove = (id) => {
        dispatch(approveSupplier(id)).then(() => {
            dispatch(fetchPendingSuppliers()); // Refresh list
        });
    };

    const handleReject = (id) => {
        dispatch(rejectSupplier(id)).then(() => {
            dispatch(fetchPendingSuppliers()); // Refresh list
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Supplier Requests</h1>
            {pendingSuppliers.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingSuppliers.map((supplier) => (
                            <tr key={supplier._id} className="border-b">
                                <td className="p-2 text-center">{supplier.name}</td>
                                <td className="p-2 text-center">{supplier.email}</td>
                                <td className="p-2 text-center">{supplier.phone}</td>
                                <td className="p-2">
                                    <div className="flex flex-col space-y-2"> {/* Column layout */}
                                        <button
                                            onClick={() => handleApprove(supplier._id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(supplier._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
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
