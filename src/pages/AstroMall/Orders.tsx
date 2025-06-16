import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';

type User = {
  playerId: string | null;
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  phone: string;
  walletBalance: number;
  Free_Chat_Available: boolean;
  followed_astrologers: any[];
  consultations: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
  photo: string;
  socketId: string | null;
  accessToken: string;
  isOnApp: boolean;
};

type OrderDetails = {
  _id: string;
  productName: string;
  image: string;
  productDescription: string;
  category: string;
  rating: number;
  brand: string;
  weight: string;
  material: string;
  originalPrice: number;
  displayPrice: number;
  in_stock: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Order = {
  _id: string;
  userId: User;
  name: string;
  city: string;
  state: string;
  phone: string;
  order_details: OrderDetails;
  delivery_date: string;
  is_order_complete: boolean;
  quantity: number;
  total_price: number;
  payment_method: string;
  is_payment_done: boolean;
  transaction_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  address: string;
  delivery_status: string;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderDetails | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Order | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleOpenProductModal = (product: OrderDetails) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleOpenInvoiceModal = (order: Order) => {
    setSelectedInvoice(order);
    setIsInvoiceOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setSelectedInvoice(null);
    setIsInvoiceOpen(false);
  };

  const handleOpenUserModal = (user: Order) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};

      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await axiosInstance.get('/order', { params });

      if (Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch Orders');
      console.error('Error fetching Orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate === '' && toDate === '') {
      fetchOrders();
    }
  }, [fromDate, toDate]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.order_details.productName.toLowerCase().includes(searchLower) ||
      order.name.toLowerCase().includes(searchLower) ||
      order.city.toLowerCase().includes(searchLower) ||
      order.state.toLowerCase().includes(searchLower) ||
      order.phone.includes(searchTerm) ||
      order.order_details.brand.toLowerCase().includes(searchLower) ||
      order.transaction_id.toLowerCase().includes(searchLower) ||
      order.delivery_status.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Breadcrumb pageName="Orders" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
          {/* Search Input */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
            <div className="flex gap-3 items-center justify-center">
              <label
                htmlFor="fromDate"
                className="text-md font-medium text-gray-600 dark:text-gray-300"
              >
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
              <label
                htmlFor="toDate"
                className="text-md font-medium text-gray-600 dark:text-gray-300"
              >
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

            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Filter
            </button>

            <button
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <p>Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-center dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Product
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      User
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Quantity
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      City
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, key) => (
                      <tr
                        key={key}
                        className="text-center border-b border-gray-300 dark:border-strokedark"
                      >
                        <td
                          className="transition py-5 px-4 xl:pl-5 cursor-pointer hover:-translate-y-1 hover:scale-110"
                          onClick={() => handleOpenProductModal(item.order_details)}
                        >
                          <div className="flex gap-4 items-center">
                            <img
                              src={item.order_details.image}
                              alt={item.order_details.productName}
                              className="h-10 w-10 rounded-full"
                            />
                            <p className="text-sm text-black dark:text-white hover:text-">
                              {item.order_details.productName}
                            </p>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <p
                            className="text-black dark:text-white cursor-pointer hover:-translate-y-1 hover:scale-110"
                            onClick={() => handleOpenUserModal(item)}
                          >
                            {item.name}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">
                            {item.quantity}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">
                            ₹{item.total_price}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{item.city}</p>
                        </td>
                        <td className="py-5 px-4">
                          <button
                            className="hover:text-primary"
                            onClick={() => handleOpenInvoiceModal(item)}
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-5 text-center">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {indexOfFirstItem + 1} to{' '}
                  {Math.min(indexOfLastItem, filteredOrders.length)} of{' '}
                  {filteredOrders.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === number
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {number}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-[75vh] max-w-lg dark:bg-boxdark">
              <h2 className="text-2xl font-bold text-center mb-6">
                {selectedProduct.productName}
              </h2>

              <div className="flex flex-col items-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.productName}
                  className="w-20 h-20 object-cover rounded-lg mb-6"
                />
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  <strong>Description:</strong>{' '}
                  {selectedProduct.productDescription}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Brand:</strong> {selectedProduct.brand}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Weight:</strong> {selectedProduct.weight}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Material:</strong> {selectedProduct.material}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>In Stock:</strong>{' '}
                    {selectedProduct.in_stock ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Rating:</strong> {selectedProduct.rating} / 5
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Original Price:</strong> ₹
                    {selectedProduct.originalPrice}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Display Price:</strong> ₹
                    {selectedProduct.displayPrice}
                  </p>
                </div>

                
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseProductModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {isInvoiceOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-[10vh]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-[85vh] max-w-2xl dark:bg-boxdark overflow-y-auto scrollbar-hide">
              <h2 className="text-2xl font-bold text-center mb-6">
                Order Invoice
              </h2>
              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-semibold mb-2">Order Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Order ID:</strong>{' '}
                      {selectedInvoice.transaction_id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Order Date:</strong>{' '}
                      {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Payment Method:</strong>{' '}
                      {selectedInvoice.payment_method}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Address:</strong> {selectedInvoice.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Order Status:</strong>{' '}
                      {selectedInvoice.is_order_complete
                        ? 'Completed'
                        : 'In Progress'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Delivery Status:</strong>{' '}
                      {selectedInvoice.delivery_status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Delivery Date:</strong>{' '}
                      {new Date(
                        selectedInvoice.delivery_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-semibold mb-2">User Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Name:</strong> {selectedInvoice.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Phone:</strong> {selectedInvoice.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>City:</strong> {selectedInvoice.city}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>State:</strong> {selectedInvoice.state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-semibold mb-2">Product Details</p>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <img
                    src={selectedInvoice.order_details.image}
                    alt={selectedInvoice.order_details.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Product Name:</strong>{' '}
                      {selectedInvoice.order_details.productName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Description:</strong>{' '}
                      {selectedInvoice.order_details.productDescription}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Brand:</strong>{' '}
                      {selectedInvoice.order_details.brand}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Weight:</strong>{' '}
                      {selectedInvoice.order_details.weight}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-semibold mb-2">Price Breakdown</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Original Price:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ₹{selectedInvoice.order_details.originalPrice}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Displayed Price:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ₹{selectedInvoice.order_details.displayPrice}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quantity:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedInvoice.quantity}
                  </p>
                </div>
                <div className="flex justify-between font-bold text-black dark:text-white mt-2">
                  <p>Total:</p>
                  <p>₹{selectedInvoice.total_price}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseInvoiceModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        {isUserModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 w-11/12 max-w-md">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
                  <img
                    src={selectedUser.userId.photo}
                    alt={selectedUser.userId.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-center text-black dark:text-white">
                  {selectedUser.userId.name}
                </h2>
                <span className="mt-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full">
                  {selectedUser.userId.email}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedUser.userId.placeOfBirth}, {selectedUser.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedUser.userId.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedUser.userId.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Joined:{' '}
                    {new Date(
                      selectedUser.userId.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Wallet Balance: ₹{selectedUser.userId.walletBalance}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCloseUserModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;