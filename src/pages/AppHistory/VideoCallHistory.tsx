import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axiosInstance from "../../utils/axiosInstance";

const VideoCallHistory = () => {
  const [callHistory, setCallHistory] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentFile, setCurrentFile] = useState(""); // Store the current file URL to be played in the modal

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const todayFormatted = today.toISOString().split("T")[0];
    const lastWeekFormatted = lastWeek.toISOString().split("T")[0];

    setFromDate(lastWeekFormatted);
    setToDate(todayFormatted);
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("/admin/get/video/history", {
        fromDate,
        toDate,
      });
      setCallHistory(response.data.data);
    } catch (error) {
      // console.error("Error fetching call history:", error.response?.data || error.message);
    }
  };

  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours} hr ${minutes} min ${seconds} sec`;
  };

  const openModal = (fileName) => {
    const fileUrl = `https://s3.ap-south-1.amazonaws.com/rudraganga2.0/${fileName}`;
    setCurrentFile(fileUrl);
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setCurrentFile(""); // Clear the file
  };

  return (
    <>
      <Breadcrumb pageName="Call History" />
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

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-4"
          >
            Fetch Call History
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Astrologer</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">User</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Call Duration</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Started Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Ended Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Total Amount</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Action</p>
          </div>
        </div>

        {callHistory.length > 0 && callHistory.map((user, key) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="flex items-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.astrologerDetails.name}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.userDetails.name}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{formatDuration(user.duration)}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.startedAt}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.endedAt}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.totalAmount}</p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <button
                onClick={() => openModal(user.recordingData.serverResponse.fileList.fileName)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Listen
              </button>
            </div>
          </div>
        ))}

        {callHistory.length === 0 && <h1 className="w-full text-center">No Data Found</h1>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-1 bg-red-500 rounded-full py-0 px-2  text-white rounded-full hover:bg-red-600"
            >
              X
            </button>
            <div className="w-[300px] h-[450px] overflow-hidden px-4">
              <video controls className="w-full h-full object-cover">
                <source src={currentFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCallHistory;
