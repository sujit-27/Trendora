import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import service from '@/lib/appwrite/service';
import authService from "@/lib/appwrite/auth";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await service.readproduct(id);
        setProduct(res);

        setValue("Title", res.Title);
        setValue("description", res.description);
        setValue("price", res.price);
        setValue("category", res.category);
        setValue("inStock", res.inStock.toString());
      } catch (err) {
        console.error("Failed to load product: " + err.message);
      }
    }
    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      data.price = Number(data.price);
      data.inStock = data.inStock === "true";

      let imageId = product.image;
      if (data.imageFile && data.imageFile.length > 0) {
        const uploadedImage = await service.uploadImage(data.imageFile[0]);
        imageId = uploadedImage?.$id;
      }

      const user = await authService.getCurrentUser();

      await service.updateProduct(user.$id, id, {
        Title: data.Title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: imageId,
        inStock: data.inStock,
      });

      console.error("Product updated successfully!");
      navigate("/admin/dashboard/my-products");
    } catch (error) {
      console.error("Update failed: " + error.message);
    }
  };

  if (!product) return <div className="text-center mt-10 text-lg">Loading product...</div>;

  return (
    <div className="ml-0 sm:ml-8 px-4 sm:px-0 max-w-full sm:max-w-none">
      <div>
        <h2 className="text-2xl font-bold text-gray-900/90 mb-5 ml-0 sm:ml-3">Edit Product : </h2>
      </div>
      <div className="shadow-lg rounded-[5px] p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Container stacks on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-7">

            <div className="space-y-7 flex-1 min-w-0">
              {/* Title */}
              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Title:</label>
                <input
                  type="text"
                  placeholder="Name of product"
                  {...register("Title", { required: "Title is required" })}
                  className="w-full sm:w-[450px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {errors.Title && <p className="text-red-500">{errors.Title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Description:</label>
                <input
                  type="text"
                  placeholder="Describe the product"
                  {...register("description", { required: "Description is required" })}
                  className="w-full sm:w-[400px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Price:</label>
                <input
                  type="number"
                  placeholder="Enter the price"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                  })}
                  className="w-full sm:w-[400px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Category:</label>
                <input
                  type="text"
                  placeholder="Category"
                  {...register("category", { required: "Category is required" })}
                  className="w-full sm:w-[400px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
              </div>

              {/* Stock Availability */}
              <div>
                <label className="mb-2 mr-2 text-xl font-semibold text-black block">Stock Availability:</label>
                <select
                  {...register("inStock", {
                    required: "Specify stock availability",
                    setValueAs: (value) => value === "true",
                  })}
                  className="w-full sm:w-[300px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
                {errors.inStock && <p className="text-red-500">{errors.inStock.message}</p>}
              </div>
            </div>

            <div className="mt-5 sm:mt-0 flex flex-col flex-shrink-0 w-full sm:w-auto sm:ml-7 h-[200px] relative">
              <label className="mb-2 mr-2 text-xl font-semibold text-black block">Change Image (optional):</label>
              <input
                type="file"
                accept="image/*"
                {...register("imageFile")}
                className="w-full sm:w-[300px] px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-400 text-white px-3 py-2 rounded-lg hover:bg-rose-200 hover:text-rose-600 transition cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
