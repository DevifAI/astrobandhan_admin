import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CategoryModal from "../../components/Modals/CatergoryModal";

type Category = {
  name: string;
  category_id: string;
  no_of_items: number;
};

const initialCategories: Category[] = [
  {
    name: "Electronics",
    category_id: "cat001",
    no_of_items: 20,
  },
  {
    name: "Fashion",
    category_id: "cat002",
    no_of_items: 15,
  },
  {
    name: "Home Appliances",
    category_id: "cat003",
    no_of_items: 10,
  },
 
];


const Categories = () => {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const handleOpenModal = (category = null) => {
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
          <div className=""></div>

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
            <p className="font-medium text-center">No of Items</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
            <p className="font-medium text-center">Actions</p>
          </div>
        </div>

        {/* Table Body */}
        {categories.map((category, index) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={index}
          >
            <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
              <p className="text-md text-black dark:text-white">{category.name}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
              <p className="text-md text-black dark:text-white">{category.category_id}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
              <p className="text-md text-black dark:text-white">{category.no_of_items}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-2">
              <button
                className="rounded-md bg-blue-300 px-3 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                onClick={() => handleOpenModal(category)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          category={selectedCategory}
          setCategories={setCategories}
        />
      )}
    </>
  );
};

export default Categories;
