import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axiosInstance from "../../utils/axiosInstance";
import ReactPaginate from "react-paginate"; // Import react-paginate
import AstroLanguagesModal from "../../modals/AstroLanguagesModal"
import toast, { Toaster } from 'react-hot-toast';

const AstroLanguages = () => {
  const [languages, setLanguages] = useState([]); // State to store languages
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(0); // State for pagination (react-paginate uses 0-based index)
  const [itemsPerPage] = useState(10); // Items per page
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch languages from the database
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axiosInstance.post("/admin/get/languages");
        setLanguages(response.data.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to fetch languages");
      }
    };

    fetchLanguages();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to the first page when searching
  };

  // Filter languages based on search query
  const filteredLanguages = languages?.filter((language) =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLanguages = filteredLanguages?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => setIsModalOpen(false);

  // Handle add language
  const handleAddLanguage = async (lang) => {

    if (lang) {
      try {
        const response = await axiosInstance.post("/admin/add/language", { name: lang });
        setLanguages([...languages, response.data.data]);
        toast.success("Language added successfully");
      } catch (error) {
        console.error("Error adding language:", error);
        toast.error("Failed to add language");
      }
    }

  };

  // Handle delete language
  const handleDeleteLanguage = async (id) => {
    try {
      await axiosInstance.delete(`/admin/language/${id}`);
      setLanguages(languages.filter((language) => language._id !== id));
      toast.success("Language deleted successfully");
    } catch (error) {
      console.error("Error deleting language:", error);
      toast.error("Failed to delete language");
    }
  };


  return (
    <>
      <Breadcrumb pageName="Languages" />

      <div className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          {/* Search Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125 rounded-lg shadow-md"
            />
            <button className="absolute left-0 top-1/2 -translate-y-1/2">
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Add Language Button */}
          <button
            onClick={openModal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 shadow-md"
          >
            Add Language
          </button>
        </div>

        {/* Languages Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {currentLanguages?.map((language) => (
            <div
              key={language._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {language.name}
              </h3>
              <button
                onClick={() => handleDeleteLanguage(language._id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(filteredLanguages?.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center items-center"}
            pageClassName={"mx-2"}
            pageLinkClassName={
              "px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
            }
            activeClassName={"bg-blue-600 text-white"}
            previousClassName={"px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"}
            nextClassName={"px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
        <AstroLanguagesModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onAddLanguage={handleAddLanguage}
        />


      </div>
      <Toaster />
    </>
  );
};

export default AstroLanguages;
