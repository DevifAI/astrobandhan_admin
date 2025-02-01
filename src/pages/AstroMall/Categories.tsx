
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
  const [dateError, setDateError] = useState<string | null>(null);

      
  // console.log(categories);

const handleDateChange = (field: "from" | "to", value: string) => {
  if (field === "from") {
    setFromDate(value);
    if (toDate && new Date(value) > new Date(toDate)) {
      setDateError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setDateError(null);
    }
  } else {
    setToDate(value);
    if (fromDate && new Date(fromDate) > new Date(value)) {
      setDateError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setDateError(null);
    }
  }
};

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

  const getFilteredCategories = () => {
    if (!fromDate && !toDate) {
      return categories; // No filters applied
    }
  
    return categories.filter((category) => {
      const categoryDate = new Date(category.createdAt); // Ensure `createdAt` exists in your data
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
  
      return (
        (!from || categoryDate >= from) &&
        (!to || categoryDate <= to)
      );
    });
  };


  return (
    <>
      <Breadcrumb pageName="Categories" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div className="flex items-center gap-4">
          <div className="flex gap-3 items-center justify-center">
      <label
        htmlFor="fromDate"
        className="text-md font-medium text-gray-600 dark:text-gray-300"
      >
        From
      </label>
      <input
        type="date"
        id="fromDate"
        value={fromDate}
        onChange={(e) => handleDateChange("from", e.target.value)}
        className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
      />
    </div>

    <div className="flex gap-3 items-center justify-center">
      <label
        htmlFor="toDate"
        className="text-md font-medium text-gray-600 dark:text-gray-300"
      >
        To
      </label>
      <input
        type="date"
        id="toDate"
        value={toDate}
        onChange={(e) => handleDateChange("to", e.target.value)}
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
  
        {/* Table Headers */}
        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium">Image</p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium">Name</p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium">No. of Items</p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium">Actions</p>
          </div>
        </div>
  
        {/* Table Body */}
        {dateError && (
      <p className="text-red-500 text-sm font-medium">{dateError}</p>
    )}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          getFilteredCategories().map((category) => (
            <div
              className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
              key={category._id}
            >
              <div className="flex items-center justify-center col-span-2">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.category_name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-gray-400"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center col-span-2">
                <p className="text-md text-black dark:text-white">
                  {category.category_name}
                </p>
              </div>
              
              <div className="flex items-center justify-center col-span-2">
                <p className="text-md text-black dark:text-white">
                  {category.totalItems}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 col-span-2">
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
          onHandleSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}
    </>
  );
};

export default Categories;