// import React, { useState } from "react";

// type Category = {
//   name: string;
//   category_id: string;
//   no_of_items: number;
// };

// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   category?: Category;  // Optional, as it can be used for both edit and add
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
// };

// const CategoryModal: React.FC<ModalProps> = ({ isOpen, onClose, category, setCategories }) => {

//   const [formData, setFormData] = useState<Category>(category || {
//     name: '',
//     category_id: '',
//     no_of_items: 0,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (category) {
//       const updatedCategories = setCategories(prevCategories => 
//         prevCategories.map(cat => 
//           cat.category_id === category.category_id ? formData : cat
//         )
//       );
//     } else {
//       setCategories(prevCategories => [...prevCategories, formData]);
//     }
//     onClose();
//   };

//   return (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 `}>
//       {/* Modal background */}
//       <div className="absolute inset-0 backdrop-blur-lg border-4"></div>

//       {/* Modal content */}
//       <div className="relative bg-white dark:bg-gray-800 p-8 shadow-lg w-full max-w-2xl h-[75vh] overflow-y-auto z-10 mt-20">
//         <h2 className="text-2xl font-bold text-center mb-4">{category ? 'Edit Category' : 'Add Category'}</h2>
        
//         <form onSubmit={handleSubmit}>
//           <label className="block mb-4">
//             Name:
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
//             />
//           </label>

//           <label className="block mb-4">
//             Category ID:
//             <input
//               type="text"
//               value={formData.category_id}
//               onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
//               required
//               className=" text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
//             />
//           </label>

//           <label className="block mb-4">
//             No of Items:
//             <input
//               type="number"
//               value={formData.no_of_items}
//               onChange={(e) => setFormData({ ...formData, no_of_items: parseInt(e.target.value) })}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 "
//             />
//           </label>

//           <div className="flex justify-end space-x-2">
//             <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Save</button>
//             <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CategoryModal;



import React, { useEffect, useRef, useState } from "react";
import { Category, NewCategory, CategoryModalProps } from "../../types/categoryTypes";
import toast from "react-hot-toast";
import axiosInstance from '../../utils/axiosInstance';
import axios from "axios";


const CLOUDINARY_CLOUD_NAME = "dlol2hjj8";

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-10 h-10"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category
}) =>
   {
    const [formData, setFormData] = useState({
      category_name:  '',
      totalItems: 0,
      image: '', // Add image field
    });
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(''); // Initialize with existing image if available
  
    console.log(category)


    useEffect(() => {
      if (category) {
        setFormData({
          ...category,
          totalItems : category.totalItems,
          image: category.imageUrl || "", // Ensure image is always a string
        });
        setPreview(category.imageUrl || ""); // Provide a fallback empty string for preview
      }
    }, [category]);

    // Handle image change (upload to Cloudinary)
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          // Create form data to send to Cloudinary
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "admin_photos_user"); // Replace with your Cloudinary preset
  
          // Upload the image to Cloudinary
          const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
          const imageUrl = response.data.secure_url; // Get the URL of the uploaded image
          console.log(imageUrl)
          setPreview(imageUrl); 
          setFormData((prevData) => ({ ...prevData, image: imageUrl })); // Store image URL in form data
        } catch (err) {
          setError("Image upload failed.");
        }
      }
    };
  
    const removeImage = () => {
      setPreview(null);
      setFormData({ ...formData, image: '' }); // Remove image from formData
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
    
      try {
        const formDataToSubmit = {
          category_name: formData.category_name,
          // no_of_items: formData.no_of_items,
          image: formData.image || null, // Include the image URL (if available)
        };
    
        // If the category is being edited, include its ID
        // if (category) {
        //   formDataToSubmit._id = category._id;
        // }
    
        // Use axiosInstance to post data as JSON
        await axiosInstance.post("/productCategory/createProductCategory", formDataToSubmit, {
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
          },
        });
    
        toast.success("Category saved successfully!"); // Success notification
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Something went wrong!"); // Error notification
      } finally {
        setLoading(false);
      }
    };
  return isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ">
  <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mt-20">
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
      {/* {category ? 'Edit Category' : 'Add Category'} */}
      Add category
    </h2>

    {error && (
      <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-lg">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Image
          </label>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-40 h-40">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Category preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <CloseIcon />
                  </button>
                </>
              ) : (
                <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <CameraIcon />
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-1 text-lg font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {preview ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={formData.category_name}
            onChange={(e) =>
              setFormData({ ...formData, category_name: e.target.value })
            }
            required
            className="mt-1 block w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Items
          </label>
          <input
            type="number"
            value={formData.totalItems}
            disabled
            className="mt-1 block w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed text-lg dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400"
            placeholder="Enter number of items"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-6 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 text-lg bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-3 py-1 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default CategoryModal;
