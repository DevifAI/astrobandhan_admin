import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';

const CreditHistory = () => {
  const [userData, setUserData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    setFromDate(lastWeek.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/admin/get/total/wallet_recharge', {
        fromDate,
        toDate,
      });
      setUserData(response.data.total);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      <Breadcrumb pageName="Credit History" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header with date filters */}
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
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
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
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
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
              />
            </div>
          </div>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-4"
          >
            Fetch Credit History
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Profile</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Name</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Contact No</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Date</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Amount</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Action</p>
          </div>
        </div>

        {/* Table Body */}
        {userData.map((user, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="flex items-center justify-center">
              <img
                src={user.profile}
                alt="User Profile"
                className="h-12.5 w-12.5 object-cover rounded-full"
              />
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.name}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.contact}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.date}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.amount}</p>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleView(user)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-md shadow-lg p-6 w-96">
            <img
              src="/watermark.png"
              alt="Watermark"
              className="absolute inset-0 w-full h-full opacity-10"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-center mb-4">Transaction Details</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID:</span>
                <span>{selectedTransaction.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedTransaction.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span>{selectedTransaction.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Mode:</span>
                <span>UPI</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{selectedTransaction.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreditHistory;
