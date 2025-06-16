import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.ts';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CategoryModal from '../../components/Modals/CatergoryModal';
import { Category } from '../../types/categoryTypes';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/productCategory');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCategories(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, categories]);

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?',
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/productCategory/delete/${categoryId}`);
      const updatedCategories = categories.filter(
        (cat) => cat._id !== categoryId,
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      alert('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMsg =
        error.response?.data?.message || 'Failed to delete category';
      setError(errorMsg);
      alert(errorMsg);
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

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  return (
    <>
      <Breadcrumb pageName="Categories" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />

          <button
            className="rounded-md bg-blue-300 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
            onClick={() => handleOpenModal()}
          >
            Add Category
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center justify-center col-span-2 font-medium">
            Image
          </div>
          <div className="flex items-center justify-center col-span-2 font-medium">
            Name
          </div>
          <div className="flex items-center justify-center col-span-2 font-medium">
            No. of Items
          </div>
          <div className="flex items-center justify-center col-span-2 font-medium">
            Actions
          </div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : paginatedCategories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No categories found.
          </div>
        ) : (
          paginatedCategories.map((category) => (
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
                  className="rounded-md bg-blue-300 px-3 py-1 text-white font-medium hover:bg-blue-600"
                  onClick={() => handleOpenModal(category)}
                >
                  Edit
                </button>
                <button
                  className="rounded-md bg-red-300 px-3 py-1 text-white font-medium hover:bg-red-600"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <div className="flex justify-center py-6 gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          category={selectedCategory}
          fetchCategories={fetchCategories}
        />
      )}
    </>
  );
};

export default Categories;
