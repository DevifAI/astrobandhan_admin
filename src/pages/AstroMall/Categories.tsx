// import { useState } from "react";
// import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import CategoryModal from "../../components/Modals/CatergoryModal";

// type Category = {
//   name: string;
//   category_id: string;
//   no_of_items: number;
// };

// const initialCategories: Category[] = [
//   {
//     name: "Electronics",
//     category_id: "cat001",
//     no_of_items: 20,
//   },
//   {
//     name: "Fashion",
//     category_id: "cat002",
//     no_of_items: 15,
//   },
//   {
//     name: "Home Appliances",
//     category_id: "cat003",
//     no_of_items: 10,
//   },
 
// ];


// const Categories = () => {
//   const [categories, setCategories] = useState<any[]>(initialCategories);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const handleOpenModal = (category = null) => {
//     setSelectedCategory(category);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedCategory(null);
//     setIsModalOpen(false);
//   };

//   const formatDuration = (durationInSeconds: number) => {
//     const hours = Math.floor(durationInSeconds / 3600);
//     const minutes = Math.floor((durationInSeconds % 3600) / 60);
//     const seconds = durationInSeconds % 60;
//     return `${hours} hr ${minutes} min ${seconds} sec`;
//   };

//   return (
//     <>
//       <Breadcrumb pageName="Categories" />
//       <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//         <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//             <div className="flex gap-3 items-center justify-center">
//               <label htmlFor="fromDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
//                 From
//               </label>
//               <input
//                 type="date"
//                 id="fromDate"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
//               />
//             </div>

//             <div className="flex gap-3 items-center justify-center">
//               <label htmlFor="toDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
//                 To
//               </label>
//               <input
//                 type="date"
//                 id="toDate"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-center gap-2">
//             <button
//               className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
//               onClick={() => handleOpenModal()}
//             >
//               Add Category
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
//           <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//             <p className="font-medium text-center text-md">Name</p>
//           </div>
//           <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//             <p className="font-medium text-center">Category ID</p>
//           </div>
//           <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//             <p className="font-medium text-center">No of Items</p>
//           </div>
//           <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//             <p className="font-medium text-center">Actions</p>
//           </div>
//         </div>

//         {/* Table Body */}
//         {categories.map((category, index) => (
//           <div
//             className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
//             key={index}
//           >
//             <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//               <p className="text-md text-black dark:text-white">{category.name}</p>
//             </div>
//             <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//               <p className="text-md text-black dark:text-white">{category.category_id}</p>
//             </div>
//             <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
//               <p className="text-md text-black dark:text-white">{category.no_of_items}</p>
//             </div>
//             <div className="flex items-center justify-center gap-4 col-span-1 sm:col-span-2 md:col-span-2">
//               <button
//                 className="rounded-md bg-blue-300 px-3 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
//                 onClick={() => handleOpenModal(category)}
//               >
//                 Edit
//               </button>

//               <button
//                 className="rounded-md bg-red-300 px-3 py-1 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-blue-300"
//                 onClick={() => handleOpenModal(category)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal Component */}
//       {isModalOpen && (
//         <CategoryModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           category={selectedCategory}
//           setCategories={setCategories}
//         />
//       )}
//     </>
//   );
// };

// export default Categories;





import { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance.ts';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CategoryModal from "../../components/Modals/CatergoryModal";
import { Category, NewCategory } from "../../types/categoryTypes";



const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/productCategory');
      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to fetch categories'
      );
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding new category
  const handleAddCategory = async (categoryData: NewCategory) => {
    try {
      const response = await axiosInstance.post('/productCategory/createProductCategory', {
        category_name: categoryData.category_name,
      no_of_items: categoryData.no_of_items
    });
    setCategories([...categories, response.data]);
    setIsModalOpen(false);
    fetchCategories();
  } catch (error: any) {
    console.error('Error adding category:', error);
    throw new Error(error.response?.data?.message || 'Failed to add category');
  }
};

  // Handle updating category
  const handleUpdateCategory = async (categoryData: NewCategory & { _id: string }) => {
    try {
      const response = await axiosInstance.patch(`/productCategory/update/${categoryData._id}`, {
        category_name: categoryData.category_name,
        no_of_items: categoryData.no_of_items
      });
      setCategories(categories.map(cat => 
        cat._id === categoryData._id ? response.data : cat
      ));
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  };

  // Handle deleting category
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axiosInstance.delete(`/productCategory/delete/${categoryId}`);
      setCategories(categories.filter(cat => cat._id !== categoryId));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setError(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleOpenModal = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Breadcrumb pageName="Categories" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center justify-center">
              <label htmlFor="fromDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
                From
              </label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
              />
            </div>

            <div className="flex gap-3 items-center justify-center">
              <label htmlFor="toDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
                To
              </label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
              onClick={() => handleOpenModal()}
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
            <p className="font-medium text-center text-md">Name</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
            <p className="font-medium text-center">Category ID</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
            <p className="font-medium text-center">Created At</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
            <p className="font-medium text-center">Actions</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          categories.map((category) => (
            <div
              className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
              key={category._id}
            >
              <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
                <p className="text-md text-black dark:text-white">
                  {category.category_name}
                </p>
              </div>
              <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
                <p className="text-md text-black dark:text-white">
                  {category._id}
                </p>
              </div>
              <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
                <p className="text-md text-black dark:text-white">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 col-span-1 sm:col-span-2 md:col-span-2">
                <button
                  className="rounded-md bg-blue-300 px-3 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                  onClick={() => handleOpenModal(category)}
                >
                  Edit
                </button>

                <button
                  className="rounded-md bg-red-300 px-3 py-1 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-blue-300"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          category={selectedCategory}
          onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}
    </>
  );
};

export default Categories;