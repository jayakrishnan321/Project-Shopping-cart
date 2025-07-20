import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ChangePassword } from '../redux/slices/authSlice';
import { changePassword } from '../redux/slices/userSlice'; // Make sure this thunk exists
import { useNavigate } from 'react-router-dom';

function ChangePasswordcomponent({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdmin = role === 'admin';

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authState = useSelector((state) =>
    isAdmin ? state.auth.adminInfo : state.user.userInfo
  );

  useEffect(() => {
    if (!authState || !authState.token) {
      navigate(isAdmin ? "/admin/login" : "/user/login");
    }
  }, [authState, navigate, isAdmin]);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (!authState?.email) {
      alert(`${isAdmin ? "Admin" : "User"} email not found.`);
      return;
    }

    try {
      const payload = {
        email: authState.email,
        oldPassword,
        newPassword,
      };

      if (isAdmin) {
        await dispatch(ChangePassword(payload)).unwrap();
      } else {
        await dispatch(changePassword(payload)).unwrap();
      }

      alert("Password changed successfully!");
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {isAdmin ? "Admin" : "User"} Change Password
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
         <button
        onClick={() => navigate(-1)}
        className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
      >
        ← Back
      </button>
      </form>
    </div>
  );
}

export default ChangePasswordcomponent;
