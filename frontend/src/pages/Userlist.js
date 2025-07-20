import React, { useEffect } from 'react';
import { userlist } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Userlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminInfo, users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminInfo || !adminInfo.token) {
        navigate('/admin/login');
        return;
      }

      try {
        await dispatch(userlist()).unwrap();
      } catch (err) {
        console.error("Error fetching users:", err);
        navigate('/admin/login');
      }
    };

    fetchUsers();
  }, [adminInfo, dispatch, navigate]);

  // 🔄 Loading state
  if (loading) {
    return <p className="text-center mt-4">Loading users...</p>;
  }

  // ❌ Error state
  if (error) {
    return <p className="text-center text-red-500 mt-4">Error: {error}</p>;
  }

  return (
    <div className="overflow-x-auto">
       <button
        onClick={() => navigate(-1)}
        className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>
      <table className="min-w-full border border-gray-300 mt-6">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Phone Number</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email} className="text-center hover:bg-gray-100">
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.phone}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">
                <img
                  src={`http://localhost:5000${user.image}`}
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="py-2 px-4 border">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Userlist;
