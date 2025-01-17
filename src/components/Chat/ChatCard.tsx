import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../../types/chat';
import UserOne from '../../images/user/user-01.png';
import UserTwo from '../../images/user/user-02.png';
import UserThree from '../../images/user/user-03.png';
import UserFour from '../../images/user/user-04.png';
import UserFive from '../../images/user/user-05.png';
import axiosInstance from '../../utils/axiosInstance';

const ChatCard = () => {
  const [chatData, setChatData] = useState([
    {
      avatar: UserOne,
      name: 'Devid Heilo',
      text: 'How are you?',
      time: 12,
      textCount: 3,
      color: '#10B981',
    },
    {
      avatar: UserTwo,
      name: 'Henry Fisher',
      text: 'Waiting for you!',
      time: 12,
      textCount: 0,
      color: '#DC3545',
    },
    {
      avatar: UserFour,
      name: 'Jhon Doe',
      text: "What's up?",
      time: 32,
      textCount: 0,
      color: '#10B981',
    },
    {
      avatar: UserFive,
      name: 'Jane Doe',
      text: 'Great',
      time: 32,
      textCount: 2,
      color: '#FFBA00',
    },
    {
      avatar: UserOne,
      name: 'Jhon Doe',
      text: 'How are you?',
      time: 32,
      textCount: 0,
      color: '#10B981',
    },
    {
      avatar: UserThree,
      name: 'Jhon Doe',
      text: 'How are you?',
      time: 32,
      textCount: 3,
      color: '#FFBA00',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response] = await Promise.all([
          axiosInstance.get<any>('/admin/pending-astrologer-requests'),
        ]);
        // console.log(response.data.data.requests);

        // Map the requests and add an avatar field based on gender
        const processedData = response.data.data.requests.map((request: any) => ({
          ...request,
          avatar: request.gender === 'male' ? UserOne : UserTwo,
        }));

        // Update state with the processed data
        setChatData(processedData);
      } catch (error: any) {
        console.error('Error fetching dashboard counts:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []); // Runs once on component mount

  const handleVerifyClick = (chat:any) => {
    setModalData(chat);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalData(null);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Pending Astrologers Request
      </h4>

      {/* Scrollable container */}
      <div className="h-100 overflow-y-auto scrollbar-hide"
      style={{
        scrollbarWidth: 'none',      // Firefox
        msOverflowStyle: 'none',     // IE and Edge
      }}
      >
        {chatData.map((chat, key) => (
          <Link
            to="/"
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-12 w-12 rounded-full">
              <img src={chat.avatar} alt="User" />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
              </div>
              <button
                className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleVerifyClick(chat);
                }}
              >
                View
              </button>
              <button
                className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleVerifyClick(chat);
                }}
              >
                Delete
              </button>
            </div>
          </Link>
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
    </div>
  );
};

export default ChatCard;


