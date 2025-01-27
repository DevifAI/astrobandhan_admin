import { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import ChatModal from "../../../components/Modals/ChatHistoryModal";
import axiosInstance from "../../../utils/axiosInstance";
import ReactPaginate from "react-paginate";
// import "./Pagination.css"; // Optional: Custom styles for pagination

const AstrologerHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatDetails, setChatDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [fromDate, setFromDate] = useState("");  // Track the "from" date
  const [toDate, setToDate] = useState("");      // Track the "to" date
  const itemsPerPage = 3; // Number of items per page

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.post("/admin/get/chat/history");
        setChatDetails(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  // Fetch chat history by date range
  const fetchChatHistoryByDate = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both 'From' and 'To' dates.");
      return;
    }

    let newFromDate = fromDate.split("-").reverse().join("-")
    let newToDate = toDate.split("-").reverse().join("-")

    try {
      const response = await axiosInstance.post("/admin/get/chat/history/bydate", {
        newFromDate,
        newToDate
      });
      setChatDetails(response.data);
    } catch (error) {
      console.error("Error fetching chat history by date:", error);
    }
  };

  const getDurationInMinutes = (duration) => {
    if (!duration || duration === "Not Started") return 0;

    if (typeof duration === "string" && duration.includes(":")) {
      const [minutes, seconds] = duration.split(":").map(Number);
      return minutes + (seconds > 0 ? 1 : 0);
    }

    if (typeof duration === "number") {
      return duration;
    }

    return 0;
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentPageData = chatDetails.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(chatDetails.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <Breadcrumb pageName="Astrologers Chat History" />

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
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 items-center justify-center">
              <label htmlFor="toDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
                To
              </label>
              <input
                type="date"
                id="toDate"
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button
              onClick={fetchChatHistoryByDate}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Astrologer</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">User</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Chat Duration</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Started Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Ended Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Chatroom Id</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Total Amount</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Action</p>
          </div>
        </div>

        {currentPageData.map((user, key) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="flex items-center col-span-1 sm:col-span-1">
              <div className="flex gap-4 justify-center items-center">
                <p className="text-sm text-black dark:text-white">
                  {user.astrologerName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <div className="flex gap-4 justify-center items-center ">
                <p className="text-sm text-black dark:text-white">
                  {user.userName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">
                {getDurationInMinutes(user.chatDuration)} mins
              </p>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.startedTime}</p>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.endedTime}</p>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.chatRoomId}</p>
            </div>

            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.totalAmount || 0}</p>
            </div>

            <div className="flex items-center justify-center col-span-1">
              <button
                onClick={() => {
                  setSelectedChat(user);
                  setIsModalOpen(true);
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                See Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chatData={selectedChat}
      />
      
      {/* Pagination */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"flex flex-row space-x-2"} // Use flex-row for horizontal layout
        pageClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for each page item
        pageLinkClassName={"page-link"}
        previousClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for previous button
        nextClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for next button
        activeClassName={"bg-blue-300 dark:bg-blue-400 text-white"} // Style for active page
      />
    </>
  );
};

export default AstrologerHistory;
