import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import service from '@/lib/appwrite/service';
import authService from '@/lib/appwrite/auth';
import { FaUpload } from "react-icons/fa";
import { PlusCircle } from 'lucide-react';

function AddBlog() {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    } else {
      console.warn("No file selected");
    }
  };

  const onSubmit = async (data) => {
    try {
      const currentUser = await authService.getCurrentUser();
      const userId = currentUser.$id;

      if (!selectedImage) {
        console.error("Please select an image first.");
        return;
      }

      const uploadResult = await service.uploadImage(selectedImage);
      const imageId = uploadResult.$id;

      if (!imageId) {
        throw new Error("Image upload failed");
      }

      const blog = await service.createBlog({
        Topic: data.Topic,
        title: data.title,
        description: data.description,
        date: data.date,
        image: imageId,
        userId,
      });

      if (blog) {
        console.error("Blog added successfully");
      }
    } catch (err) {
      console.error(err.message);
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="ml-0 sm:ml-8 max-w-full sm:w-[1100px] px-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900/90 ml-0 sm:ml-3">Add Blogs :</h2>
        </div>

        <div className="relative mt-5 shadow-lg rounded-[5px] p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-7">

              <div className="space-y-5">
                <div>
                  <label className="mb-2 mr-2 text-xl font-semibold text-black block">Topic :</label>
                  <input
                    type="text"
                    placeholder="e.g. Business"
                    {...register("Topic", { required: "Topic is required" })}
                    className="w-full sm:w-[600px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {errors.Topic && <p className="text-red-500 text-sm mt-1">{errors.Topic.message}</p>}
                </div>

                <div>
                  <label className="mb-2 mr-2 text-xl font-semibold text-black block">Title :</label>
                  <input
                    type="text"
                    placeholder="Title of Blog"
                    {...register("title", { required: "Title is required" })}
                    className="w-full sm:w-[600px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="mb-2 mr-2 text-xl font-semibold text-black block">Description :</label>
                  <input
                    type="text"
                    placeholder="Describe the product"
                    {...register("description")}
                    className="w-full sm:w-[550px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="mb-2 mr-2 text-xl font-semibold text-black block">Date :</label>
                  <input
                    type="date"
                    placeholder="Enter the date"
                    {...register("date", { required: "Enter the date" })}
                    className="w-full sm:w-[600px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Upload Image :</label>

                <div className="relative inline-block w-[170px] p-1 rounded-[5px] bg-gray-50">
                  <span className="text-gray-400 ml-1">Upload image</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-center gap-2 text-rose-500 hover:text-rose-700 cursor-pointer placeholder:text-gray-300"
                  >
                    <FaUpload className="text-xl absolute right-1 top-1" />
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="mt-5 h-50 w-full max-w-[400px] object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-400 text-white px-6 py-2 rounded-lg hover:bg-rose-200 hover:text-rose-600 transition cursor-pointer flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBlog;
