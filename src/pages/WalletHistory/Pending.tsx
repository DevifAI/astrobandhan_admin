import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';

const Pending = () => {
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
    handleSubmit();
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/admin/get/total/withdrawl/details', {
        fromDate,
        toDate,
      });
      console.log({ response })
      setUserData(response.data.total.reverse());
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


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = userData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(userData.length / itemsPerPage);


  const handlePaymentRequest = async (isPaymentDone) => {
    try {
      const payload = {
        isPaymentDone,
        payment_id: selectedTransaction._id, // Assuming the transaction ID is stored in _id
      };

      const response = await axiosInstance.post('/admin/payment/request', payload);
      console.log('Payment request response:', response.data);

      // Optionally, you can update the state or show a success message
      if (isPaymentDone && (response.data.statusCode === 200 || response.data.statusCode === 201)) {
        toast.success('Payment status updated to Paid.');
      } else {
        toast.success('Approval status updated to Rejected.');
      }

      // Close the modal and refresh the data
      closeModal();
      handleSubmit(); // Refetch the data to reflect the changes
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      toast.error('Failed to update payment status.');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Withdral Request" />

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
            onClick={() => handleSubmit()}
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
            <p className="font-medium text-center">Date</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Amount</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Status</p>
          </div>

          <div className="flex items-center justify-center">
            <p className="font-medium text-center">Action</p>
          </div>
        </div>

        {/* Table Body */}
        {currentItems.map((user, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="flex items-center justify-center">
              <img
                src={user.astrologerId.avatar}
                alt="User Profile"
                className="h-12.5 w-12.5 object-cover rounded-full"
              />
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.astrologerId.name}</p>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.createdAt.split("T")[0]}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-black dark:text-white">{user.amount}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className={`text-sm text-black dark:text-white px-2 py-1 rounded ${user.isPaymentDone && user.isApproved === "true"
                ? "bg-green-100 text-green-500 font-bold"
                : user.isPaymentDone === false && user.isApproved === "false"
                  ? "bg-yellow-100 text-yellow-500 font-bold"
                  : user.isPaymentDone === false && user.isApproved === "reject"
                    ? "bg-red-100 text-red-500 font-bold"
                    : ""
                }`}>
                {user.isPaymentDone && user.isApproved === "true"
                  ? "Paid"
                  : user.isPaymentDone === false && user.isApproved === "false"
                    ? "Not Paid"
                    : user.isPaymentDone === false && user.isApproved === "reject"
                      ? "Rejected"
                      : ""}
              </p>
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
      </div >

      {/* Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-95 hover:scale-100">
            {/* Watermark */}
            <img
              src="/watermark.png"
              alt="Watermark"
              className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
            />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
              Transaction Details
            </h3>

            {/* Transaction Info */}
            <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
              {/* Transaction ID */}
              {/* <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Transaction ID:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTransaction._id}
                </span>
              </div> */}

              {/* Astrologer Name */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Astrologer Name:</span>
                <span className="text-sm">
                  {selectedTransaction.astrologerId?.name || "N/A"}
                </span>
              </div>

              {/* Contact */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Contact:</span>
                <span className="text-sm">
                  {selectedTransaction.astrologerId?.phone || "N/A"}
                </span>
              </div>

              {/* Amount */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Amount:</span>
                <span className="text-sm">
                  ₹{selectedTransaction.amount || "N/A"}
                </span>
              </div>

              {/* Withdrawal Type */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Withdrawal Type:</span>
                <span className="text-sm">
                  {selectedTransaction.withdrawalType || "N/A"}
                </span>
              </div>

              {/* Bank Details or UPI ID */}
              {selectedTransaction.withdrawalType === "bank" && (
                <div className="flex flex-col gap-2 border-b pb-2">
                  <span className="font-medium">Bank Details:</span>
                  <div className="text-sm">
                    <p>Account Holder: {selectedTransaction.bankDetails?.accountHolderName || "N/A"}</p>
                    <p>Account Number: {selectedTransaction.bankDetails?.accountNumber || "N/A"}</p>
                    <p>IFSC Code: {selectedTransaction.bankDetails?.ifscCode || "N/A"}</p>
                  </div>
                </div>
              )}

              {selectedTransaction.withdrawalType === "upi" && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">UPI ID:</span>
                  <span className="text-sm">
                    {selectedTransaction.upiId || "N/A"}
                  </span>
                </div>
              )}

              {/* Payment Status */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Payment Status:</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${selectedTransaction.isPaymentDone ? "bg-green-100 text-green-500" : selectedTransaction.isApproved === "false" ? "bg-yellow-100 text-yellow-500" : "bg-red-100 text-red-500"}`}
                >
                  {selectedTransaction.isPaymentDone ? "Completed" : selectedTransaction.isApproved === "false" ? "Pending" : "Not Approved"}
                </span>
              </div>

              {/* Approval Status */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Approval Status:</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${selectedTransaction.isApproved === "true"
                    ? "bg-green-100 text-green-500 font-bold"
                    : selectedTransaction.isApproved === "false"
                      ? "bg-yellow-100 text-yellow font-bold"
                      : "bg-red-100 text-red font-bold"
                    }`}
                >
                  {selectedTransaction.isApproved === "true" ? "Approved" : selectedTransaction.isApproved === "false" ? "Pending" : "Reject"}
                </span>
              </div>


              {/* Date */}
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span className="text-sm">
                  {new Date(selectedTransaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className='w-full flex justify-center gap-4'>
              {!selectedTransaction?.isPaymentDone && selectedTransaction.isApproved == "false" && (
                <div className="mt-6 flex justify-center">
                  <button
                    // onClick={closeModal}
                    onClick={() => handlePaymentRequest(true)}
                    className=" border-2 border-blue-500  text-blue-500 font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
                  >
                    Already Paid ?
                  </button>
                </div>
              )}
              {!selectedTransaction?.isPaymentDone && selectedTransaction.isApproved == "false" && (
                <div className="mt-6 flex justify-center">
                  <button
                    // onClick={closeModal}
                    onClick={() => handlePaymentRequest(false)}
                    className=" border-2 border-red-500  text-red-500 font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center mt-4 space-x-2'}
        pageClassName={'px-3 py-1 border rounded-md hover:bg-blue-300'}
        activeClassName={'bg-blue-500 text-white'}
      />
        <Toaster />
    </>
  );
};

export default Pending;
