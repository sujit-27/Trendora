import authService from '@/lib/appwrite/auth';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const ManageCredential = () => {
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.account.get();
        setUser(userData);

        // Set default form values when user is fetched
        setValue('name', userData.name);
        setValue('email', userData.email);
      } catch (err) {
        console.error('Failed to fetch user: ' + err.message);
      }
    };

    fetchUser();
  }, [setValue]);

  const onSubmit = async (data) => {
    const { name, email, currentpassword, newpassword } = data;

    try {
      await authService.account.updateName(name);
      await authService.account.updateEmail(email, currentpassword);

      if (currentpassword && newpassword) {
        await authService.account.updatePassword(newpassword, currentpassword);
      }

      toast.success('Credentials Updated Successfully!');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-full px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl ml-0 sm:ml-8 mt-5">
      <h2 className="text-2xl font-bold text-gray-900/90 mb-5 ml-0 sm:ml-3">
        Manage Account Details:
      </h2>
      <div className="shadow-lg rounded-[5px] p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

          {/* Name */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-black">Name :</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register('name', { required: 'Name is required' })}
              className="w-full sm:w-[470px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-black">Email :</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
              className="w-full sm:w-[470px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Current Password */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-black">Current Password :</label>
            <input
              type="password"
              placeholder="Enter your current password"
              {...register('currentpassword', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' },
              })}
              className="w-full sm:w-[420px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            {errors.currentpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentpassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-black">New Password :</label>
            <input
              type="password"
              placeholder="Enter your new password"
              {...register('newpassword', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' },
              })}
              className="w-full sm:w-[450px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            {errors.newpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newpassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-200 hover:text-rose-600 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageCredential;
