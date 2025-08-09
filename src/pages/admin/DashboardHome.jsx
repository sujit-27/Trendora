import React from 'react'

const DashboardHome = () => {

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
        navigate("/login");
    };

    return (
        <div className='p-8'>
            <h2 className="text-xl text-gray-800 font-semibold leading-10">Welcome to your <span className='text-rose-400'>Admin</span> Dashboard. Here, you can manage all aspects of your product inventory. Use the sidebar to add new products, view existing ones, and make updates or deletions as needed. This dashboard is designed to give you full control and visibility over your eCommerce platform's backend operations.</h2>

            <h2 className='mt-7 font-semibold'>Not You? <button onClick={handleLogout} className='text-gray-600 hover:text-rose-400 hover:underline cursor-pointer'>Logout</button></h2>
        </div>
    )
}

export default DashboardHome
