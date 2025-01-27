import {useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

import UserOne from "../../images/user/user-01.png";
import axiosInstance from "../../utils/axiosInstance";

  
const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
  
    // console.log(orders)
    // console.log({selectedProduct})
      // console.log({selectedInvoice})
    // console.log({selectedUser})


    const handleOpenProductModal = (product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    };
  
    const handleCloseProductModal = () => {
      setSelectedProduct(null);
      setIsModalOpen(false);
    };
  
    const handleOpenInvoiceModal = (order) => {
      setSelectedInvoice(order);
      setIsInvoiceOpen(true);
    };
  
    const handleCloseInvoiceModal = () => {
      setSelectedInvoice(null);
      setIsInvoiceOpen(false);
    };
    const handleOpenUserModal = (user) => {
      setSelectedUser(user);
      setIsUserModalOpen(true);
    };
  
    const handleCloseUserModal = () => {
      setSelectedUser(null);
      setIsUserModalOpen(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get('/order/');
          if (Array.isArray(response.data.data)) {
            setOrders(response.data.data);
            // console.log({orders})
          }
        } catch (error: any) {
          setError(
            error.response?.data?.message || 'Failed to fetch Orders'
          );
          console.error('Error fetching Orders:', error);
        } finally {
          setLoading(false);
        }
      };

       useEffect(() => {
          fetchOrders();
        }, []);

  return (
    <>
      <Breadcrumb pageName="Orders" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      
        <div className="flex items-center gap-4 my-4 ">
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

         
      
     
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-center dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white ">
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
            {orders.map((Item, key) => (
              <tr
                key={key}
                className="text-center border-b border-gray-300 dark:border-strokedark"
              >
                <td
                  className=" transition py-5 px-4 xl:pl-5 cursor-pointer hover:-translate-y-1 hover:scale-110"
                  onClick={() => handleOpenProductModal(Item.order_details)}
                >
                  <div className="flex gap-4  items-center">
                    <img
                      src={Item.order_details.image}
                      alt={Item.order_details.productName}
                      className="h-10 w-10 rounded-full"
                    />
                    <p className="text-sm text-black dark:text-white hover:text-">
                      {Item.order_details.productName}
                    </p>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white cursor-pointer hover:-translate-y-1 hover:scale-110" onClick={() => handleOpenUserModal(Item)} >{Item.name}</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">{Item.quantity}</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">{Item.total_price}</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black dark:text-white">{Item.city}</p>
                </td>
                <td className="py-5 px-4">
                <button
                      className="hover:text-primary"
                      onClick={() => handleOpenInvoiceModal(Item)}
                    >Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
       <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-[75vh] max-w-lg dark:bg-boxdark">
         <h2 className="text-2xl font-bold text-center mb-6">{selectedProduct.productName}</h2>
         
         <div className="flex flex-col items-center">
           <img
             src={selectedProduct.image}
             alt={selectedProduct.productName}
             className="w-20 h-20 object-cover rounded-lg mb-6"
           />
           <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
             <strong>Description:</strong> {selectedProduct.productDescription}
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
               <strong>Category:</strong> {selectedProduct.category}
             </p>
             <p className="text-sm text-gray-600 dark:text-gray-300">
               <strong>In Stock:</strong> {selectedProduct.in_stock ? "Yes" : "No"}
             </p>
             <p className="text-sm text-gray-600 dark:text-gray-300">
               <strong>Rating:</strong> {selectedProduct.rating} / 5
             </p>
             <p className="text-sm text-gray-600 dark:text-gray-300">
               <strong>Original Price:</strong> ₹{selectedProduct.originalPrice}
             </p>
             <p className="text-sm text-gray-600 dark:text-gray-300">
               <strong>Display Price:</strong> ₹{selectedProduct.displayPrice}
             </p>
           </div>
         </div>
     

     
         <div className="flex justify-end mt-6">
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
           <h2 className="text-2xl font-bold text-center mb-6">Order Invoice</h2>
           <div className="border-b pb-4 mb-4">
             <p className="text-lg font-semibold mb-2">Order Summary</p>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Order ID:</strong> {selectedInvoice.transaction_id}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Order Date:</strong>{new Date(selectedInvoice.createdAt).toLocaleDateString()}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Payment Method:</strong> {selectedInvoice.payment_method}
                 </p>
               </div>
               <div>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Order Status:</strong>{" "}
                   {selectedInvoice.is_order_complete ? "Completed" : "In Progress"}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Delivery Status:</strong>{" "}
                   {/* {selectedInvoice.cancel_order.isCancel ? "Cancelled" : "On Schedule"} */}
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
                   <strong>Product Name:</strong> {selectedInvoice.order_details.productName}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Description:</strong> {selectedInvoice.order_details.productDescription}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Brand:</strong> {selectedInvoice.order_details.brand}
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   <strong>Weight:</strong> {selectedInvoice.order_details.weight}
                 </p>
               </div>
             </div>
           </div>
       
           <div className="border-b pb-4 mb-4">
             <p className="text-lg font-semibold mb-2">Price Breakdown</p>
             <div className="flex justify-between">
               <p className="text-sm text-gray-600 dark:text-gray-300">Original Price:</p>
               <p className="text-sm text-gray-600 dark:text-gray-300">
                 ₹{selectedInvoice.order_details.originalPrice}
               </p>
             </div>
             <div className="flex justify-between">
               <p className="text-sm text-gray-600 dark:text-gray-300">Displayed Price:</p>
               <p className="text-sm text-gray-600 dark:text-gray-300">
                 ₹{selectedInvoice.order_details.displayPrice}
               </p>
             </div>
             <div className="flex justify-between">
               <p className="text-sm text-gray-600 dark:text-gray-300">Quantity:</p>
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

{/* user Modal */}

{isUserModalOpen && selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 w-11/12 max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
          <img 
            src={selectedUser.userId.photo} 
            alt={selectedUser.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
        {selectedUser.name} 
        </h2>
        <span className="mt-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full">
          {selectedUser.totalOrders} Orders
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
            {selectedUser.city}, {selectedUser.state}
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
            {selectedUser.phone}
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
            Joined: {new Date(selectedUser.userId.createdAt).toLocaleDateString()}
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Latest Order: {new Date(selectedUser.createdAt).toLocaleDateString()}
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
  )
}

export default Orders