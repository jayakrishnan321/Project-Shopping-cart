import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ChangePassword } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
function AdminChangePassword() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { adminInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!adminInfo || !adminInfo.token) {
            navigate("/admin/login");
        }
    }, [adminInfo, navigate]);

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }

        if (!adminInfo?.email) {
            alert("Admin email not found.");
            return;
        }

        try {
            await dispatch(ChangePassword({
                email: adminInfo.email,
                oldPassword,
                newPassword,
            })).unwrap();

            alert("Password changed successfully!");
            navigate('/admin/dashboard')
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
                    e.preventDefault(); // prevent page reload
                    handleSubmit();
                }}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>

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
            </form>
        </div>
    )
}

export default AdminChangePassword
