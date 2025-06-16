import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import UserOne from '../../images/user/user-01.png';
import UserTwo from '../../images/user/user-02.png';
import axiosInstance from '../../utils/axiosInstance';

const ChatCard = () => {
  const [chatData, setChatData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/admin/pending-astrologer-requests');
        const processedData = response.data.data.requests.map((request) => ({
          ...request,
          avatar: request.gender === 'male' ? UserOne : UserTwo,
        }));
        setChatData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error('Error fetching astrologer requests:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  // Filter astrologers when search term changes
  useEffect(() => {
    const filtered = chatData.filter((chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, chatData]);


  const handleDelete = async (id: string) => {

    try {
      await axiosInstance.post('/admin/delete-astrologer-requests', { userId: id });
      setChatData((prevData) => prevData.filter((chat) => chat._id !== id));
      toast.success('Astrologer Deleted Successfully');
    } catch (error) {
      toast.error('Error deleting astrologer request');
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Pending Astrologers Request
      </h4>

      {/* 🔍 Search Bar */}
      <div className="px-6 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Scrollable container */}
      <div className="h-100 overflow-y-auto scrollbar-hide">
        {filteredData.length > 0 ? (
          filteredData.map((chat) => (
            <div
              key={chat._id}
              className="flex items-center gap-4 py-3 px-6 hover:bg-gray-200 dark:hover:bg-meta-4 border-b border-stroke dark:border-strokedark"
            >
              {/* Avatar */}
              <div className="relative h-14 w-14 rounded-full overflow-hidden">
                <img src={chat?.avatar} alt="User" className="object-cover w-full h-full" />
              </div>

              {/* Chat Info */}
              <div className="flex-1 flex flex-col gap-1">
                <h5 className="font-medium text-black dark:text-white">{chat.name}</h5>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="rounded-md bg-blue-300 px-4 py-2 text-white font-medium hover:bg-blue-600"
                  onClick={() => {
                    setModalData(chat);
                    setModalVisible(true);
                  }}
                >
                  View
                </button>
                <button
                  className="rounded-md bg-red-300 px-4 py-2 text-white font-medium hover:bg-red-600"
                  onClick={() => handleDelete(chat._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No astrologers found.</p>
        )}
      </div>

      {/* Modal */}
      {modalVisible && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Astrologer Details</h3>
              <button onClick={() => setModalVisible(false)} className="text-black">X</button>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <img src={modalData.avatar} alt="Astrologer" className="h-16 w-16 rounded-full mr-4" />
                <div>
                  <h4 className="text-lg font-semibold">{modalData.name}</h4>
                  <p className="text-sm">Phone: {modalData.phoneNumber}</p>
                  <p className="text-sm">Experience: {modalData.experience} years</p>
                  <p className="text-sm">City: {modalData.city}</p>
                  <p className="text-sm">State: {modalData.state}</p>
                  <p className="text-sm">Language: {modalData.language.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ChatCard;
