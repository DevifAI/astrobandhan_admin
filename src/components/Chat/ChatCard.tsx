import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../../types/chat';
import UserOne from '../../images/user/user-01.png';
import UserTwo from '../../images/user/user-02.png';
import axiosInstance from '../../utils/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

const ChatCard = () => {
  const [chatData, setChatData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>('/admin/pending-astrologer-requests');
        const processedData = response.data.data.requests.map((request: any) => ({
          ...request,
          avatar: request.gender === 'male' ? UserOne : UserTwo,
        }));
        setChatData(processedData);
      } catch (error: any) {
        console.error('Error fetching astrologer requests:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []); // Runs once on component mount

  const handleVerifyClick = (chat: any) => {
    setModalData(chat);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalData(null);
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     // Send DELETE request to remove the astrologer request
  //     const response = await axiosInstance.post('/admin/delete-astrologer-requests', {
  //       userId: id,
  //     });

  //     // Remove the deleted request from the state
  //     setChatData(prevData => prevData.filter(chat => chat._id !== id));

  //     // Show success message
  //     toast.success("Astrologer Deleted Successfully", {
  //       position: 'top-center',
  //       duration: 3000, // Automatically close the toast after 3 seconds
  //     });
  //     setErrorMessage('');
  //   } catch (error: any) {
  //     // Show error message if the deletion fails
  //     toast.error("Error deleting astrologer request", {
  //       position: 'top-center',
  //       duration: 3000, // Automatically close the toast after 3 seconds
  //     });
  //     setSuccessMessage('');
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      // Send DELETE request to remove the astrologer request
      const response = await axiosInstance.post('/admin/delete-astrologer-requests', {
        userId: id,
      });

      // Remove the deleted request from the state
      setChatData(prevData => prevData.filter(chat => chat._id !== id));

      // Show success message
      toast.success("Astrologer Deleted Successfully", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      setErrorMessage('');
    } catch (error: any) {
      // Show error message if the deletion fails
      toast.error("Error deleting astrologer request", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      setSuccessMessage('');
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Pending Astrologers Request
      </h4>

      {/* Success/Error Messages */}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      {/* Scrollable container */}
      <div className="h-100 overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',      // Firefox
          msOverflowStyle: 'none',     // IE and Edge
        }}
      >
        {chatData?.length > 0 && chatData.map((chat, key) => (
          <div
            key={key}
            className="flex items-center gap-4 py-3 px-6 hover:bg-gray-200 dark:hover:bg-meta-4 border-b border-stroke dark:border-strokedark"
          >
            {/* Avatar */}
            <div className="relative h-14 w-14 rounded-full overflow-hidden">
              <img src={chat?.avatar} alt="User" className="object-cover w-full h-full" />
            </div>

            {/* Chat Info */}
            <div className="flex-1 flex flex-col gap-1">
              <h5 className="font-medium text-black dark:text-white">{chat.name}</h5>
              {/* <p className="text-sm text-gray-500 dark:text-gray-300">{chat.bio}</p> */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="rounded-md bg-blue-300 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleVerifyClick(chat);
                }}
              >
                View
              </button>
              <button
                className="rounded-md bg-red-300 px-4 py-2 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(chat._id);  // Pass the chat ID to delete the astrologer request
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 backdrop-blur-sm bg-opacity-30">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Astrologer Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-300"
              >
                X
              </button>
            </div>
            {modalData && (
              <div className="mt-4">
                <div className="flex items-center">
                  <img
                    src={modalData.avatar}
                    alt="Astrologer"
                    className="h-16 w-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{modalData.name}</h4>
                    <p className="text-sm text-white">{modalData.bio}</p>
                    <p className="text-sm text-white">Phone: {modalData.phoneNumber}</p>
                    <p className="text-sm text-white">Experience: {modalData.experience} years</p>
                    <p className="text-sm text-white">City: {modalData.city}</p>
                    <p className="text-sm text-white">State: {modalData.state}</p>
                    <p className="text-sm text-white">Language: {modalData.language.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default ChatCard;
