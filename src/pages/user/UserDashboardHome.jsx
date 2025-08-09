import React from "react";

export default function UserDashboardHome() {

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="p-6 text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
        <p>Here you can view your orders, update your profile, and manage your account.</p>
        <h2 className='mt-7 font-semibold'>Not You? <button onClick={handleLogout} className='text-gray-600 hover:text-rose-400 hover:underline cursor-pointer'>Logout</button></h2>
        </div>
    );
}
