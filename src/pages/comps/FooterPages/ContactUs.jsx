import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isSubmitSuccessful } 
  } = useForm();

  const onSubmit = (data) => {
    toast.success('Thank you for contacting us!');
    console.log('Form Data:', data);
  };

  return (
    <div className="max-w-md mt-3 mx-auto p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Contact Us</h2>
      {isSubmitSuccessful && (
        <p className="mb-4 text-green-600">Your message has been sent successfully!</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-rose-400
              ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
            })}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-rose-400
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block mb-1 font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows="5"
            {...register('message', { required: 'Message is required' })}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-rose-400
              ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.message && <p className="mt-1 text-red-600 text-sm">{errors.message.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded transition disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
