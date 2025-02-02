import React, { useState, useEffect } from "react";

import ReactPaginate from "react-paginate";
import axiosInstance from "../../../utils/axiosInstance";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

const AiAstrologerHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatDetails, setChatDetails] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items per page

  // Set default dates to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  }, []);

  // Fetch chat history on component mount or when dates change
  useEffect(() => {
    fetchChatHistory();
  }, [fromDate, toDate]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const response = await axiosInstance.post("/admin/get/ai/chats/history", {
        fromDate,
        toDate,
      });

      if (response.data.data) {
        setChatDetails(response.data.data);
      } else {
        setChatDetails([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Handle page change for pagination
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Calculate paginated data
  const offset = currentPage * itemsPerPage;
  const paginatedChatDetails = chatDetails.slice(offset, offset + itemsPerPage);

  return (
    <>
      {/* <Breadcrumb pageName="AI Astrologers History" /> */}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Date Filters */}
        <div className="py-6 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center">
              <label htmlFor="fromDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
                From
              </label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700"
              />
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="toDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
                To
              </label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700"
              />
            </div>
            <button
              onClick={fetchChatHistory}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark">
          <p className="font-medium text-center">Astrologer</p>
          <p className="font-medium text-center">User</p>
          <p className="font-medium text-center">Chat Duration</p>
          <p className="font-medium text-center">Started Time</p>
          <p className="font-medium text-center">Ended Time</p>
          <p className="font-medium text-center">Total Amount</p>
          <p className="font-medium text-center">Action</p>
        </div>

        {/* Table Body */}
        {paginatedChatDetails.map((chat) => (
          <div
            className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            key={chat._id}
          >
            <p className="text-sm text-black dark:text-white text-center">{chat.aiAstroId?.name || "N/A"}</p>
            <p className="text-sm text-black dark:text-white text-center">{chat.userId?.name || "N/A"}</p>
            <p className="text-sm text-black dark:text-white text-center">{chat.duration}</p>
            <p className="text-sm text-black dark:text-white text-center">{chat.startTime}</p>
            <p className="text-sm text-black dark:text-white text-center">{chat.isChatEnded ? "Ended" : "Ongoing"}</p>
            <p className="text-sm text-black dark:text-white text-center">{chat.amount}</p>
            <div className="text-center">
              <button
                onClick={() => {
                  setSelectedChat(chat);
                  setIsModalOpen(true);
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                See Chat
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center py-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(chatDetails.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex gap-2"}
            activeClassName={"active bg-blue-500 text-white"}
            pageClassName={"px-3 py-1 border rounded-md"}
            previousClassName={"px-3 py-1 border rounded-md"}
            nextClassName={"px-3 py-1 border rounded-md"}
            breakClassName={"px-3 py-1"}
          />
        </div>
      </div>

      {/* Chat Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-999">
          <div className="bg-white dark:bg-boxdark w-full max-w-2xl rounded-lg shadow-lg flex flex-col mt-10 md:mt-0 h-[80vh] sm:h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-strokedark shrink-0">
              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white">Chat History</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollbarColor: 'transparent transparent',
              }}
            >
              {selectedChat?.messages.map((message, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  {/* User's Question (Right Side) */}
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                      <p>{message.question}</p>
                      <span className="text-xs text-gray-200">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* AI's Answer (Left Side) */}
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg p-3 max-w-[70%]">
                      <p>{message.answer}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-300">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t dark:border-strokedark shrink-0">
              <div className="flex items-center gap-2">
                <p className="text-center w-full">Chat history is read-only</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAstrologerHistory;