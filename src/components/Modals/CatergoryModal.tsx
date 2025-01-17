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


import React, { useState } from "react";
import { Category, NewCategory, CategoryModalProps } from "../../types/categoryTypes";

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category, onSubmit }) => {
  const [formData, setFormData] = useState<NewCategory>({
    category_name: category?.category_name || '',
    no_of_items: category?.no_of_items || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = category 
        ? { ...formData, _id: category._id }
        : formData;
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
      <div className="absolute inset-0 backdrop-blur-lg border-4"></div>

      <div className="relative bg-white dark:bg-gray-800 p-8 shadow-lg w-full max-w-2xl h-auto overflow-y-auto z-10 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {category ? 'Edit Category' : 'Add Category'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name:
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              required
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              No of Items:
            </label>
            <input
              type="number"
              value={formData.no_of_items}
              onChange={(e) => setFormData({ ...formData, no_of_items: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter number of items"
            />
          </div>

          {category && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category ID:
              </label>
              <input
                type="text"
                value={category._id}
                disabled
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed ${
                loading ? 'cursor-wait' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;