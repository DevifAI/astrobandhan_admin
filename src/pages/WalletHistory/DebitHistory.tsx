import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';
import ReactPaginate from 'react-paginate';

const DebitHistory = () => {
  const [userData, setUserData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setFromDate(lastWeek.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchDebitHistory();
    }
  }, [fromDate, toDate]);

  const fetchDebitHistory = async () => {
    try {
      const res = await axiosInstance.post('/admin/get/total/withdrawl/details', {
        fromDate,
        toDate,
      });
      const filtered = res.data.total.reverse().filter((entry) => entry.isPaymentDone);
      setUserData(filtered);
      setCurrentPage(0); // Reset to first page on new fetch
    } catch (error) {
      console.error('Error fetching debit history:', error.message);
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

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = userData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(userData.length / itemsPerPage);

  return (
    <>
      <Breadcrumb pageName="Debit History" />

      {/* Date Filter & Fetch Button */}
      <div className="rounded-md border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-black dark:text-white dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-black dark:text-white dark:border-gray-700"
              />
            </div>
          </div>
          <button
            onClick={fetchDebitHistory}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Fetch Debit History
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 bg-gray-100 border-b border-gray-300 py-3 px-4 dark:bg-gray-800 dark:border-strokedark mt-4 text-sm font-semibold text-gray-700 dark:text-white">
        <div className="text-center">Profile</div>
        <div className="text-center">Name</div>
        <div className="text-center">Contact No</div>
        <div className="text-center">Date</div>
        <div className="text-center">Amount</div>
        <div className="text-center">Action</div>
      </div>

      {/* Table Body */}
      {currentItems.map((user) => (
        <div
          key={user._id}
          className="grid grid-cols-6 border-b border-stroke py-4 px-4 dark:border-strokedark text-sm"
        >
          <div className="flex justify-center">
            <img
              src={user.profile}
              alt="User Profile"
              className="h-12 w-12 object-cover rounded-full"
            />
          </div>
          <div className="flex justify-center items-center">{user.astrologerId?.name || '-'}</div>
          <div className="flex justify-center items-center">{user.astrologerId?.phone || '-'}</div>
          <div className="flex justify-center items-center">{user.createdAt?.split('T')[0]}</div>
          <div className="flex justify-center items-center">₹{user.amount}</div>
          <div className="flex justify-center items-center">
            <button
              onClick={() => handleView(user)}
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
            >
              View
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
            <img
              src="/watermark.png"
              alt="Watermark"
              className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
            />
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-center mb-4 text-gray-800 dark:text-white">
              Transaction Details
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Name:</span>
                <span>{selectedTransaction.astrologerId?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Contact:</span>
                <span>{selectedTransaction.astrologerId?.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Amount:</span>
                <span>₹{selectedTransaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{selectedTransaction.createdAt?.split('T')[0]}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-6">
          <ReactPaginate
            previousLabel={'← Previous'}
            nextLabel={'Next →'}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={'flex justify-center gap-2'}
            pageClassName={'px-3 py-1 border rounded-md hover:bg-blue-100 dark:border-gray-600'}
            activeClassName={'bg-blue-500 text-white'}
            previousClassName={'px-3 py-1 border rounded-md'}
            nextClassName={'px-3 py-1 border rounded-md'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
          />
        </div>
      )}
    </>
  );
};

export default DebitHistory;
