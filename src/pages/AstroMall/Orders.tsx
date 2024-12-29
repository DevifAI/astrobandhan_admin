import { SetStateAction, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

import UserOne from "../../images/user/user-01.png";

const orders = [
    {
      userId: "60c72b2f5f1b2c001cbe0c55", // Example ObjectId referencing User
      name: "John Doe",
      city: "New York",
      state: "NY",
      phone: "+1234567890",
      order_details: {
        productName: "Smartwatch",
        image: UserOne,
        productDescription: "Feature-packed smartwatch with heart rate monitoring.",
        category: "60c72b2f5f1b2c001cbe0c63",
        rating: 4.3,
        brand: "Apple",
        weight: "50g",
        originalPrice: 300,
        displayPrice: 280,
        in_stock: true
      },
      delivery_date: new Date('2024-01-15'),
      is_order_complete: false,
      cancel_order: {
        isCancel: false,
        cancel_date_time: null
      },
      quantity: 2,
      total_price: 200,
      payment_method: "credit_card",
      is_payment_done: true,
      transaction_id: "txn_abc123"
    },
    {
      userId: "60c72b2f5f1b2c001cbe0c56", // Example ObjectId referencing another User
      name: "Jane Smith",
      city: "Los Angeles",
      state: "CA",
      phone: "+9876543210",
      order_details: {
        productName: "Gaming Laptop",
        image: UserOne,
        productDescription: "High-performance laptop for gaming and content creation.",
        category: "60c72b2f5f1b2c001cbe0c64",
        rating: 4.8,
        brand: "Dell",
        weight: "2.5kg",
        originalPrice: 1200,
        displayPrice: 1100,
        in_stock: true
      },
      delivery_date: new Date('2024-02-10'),
      is_order_complete: true,
      cancel_order: {
        isCancel: false,
        cancel_date_time: null
      },
      quantity: 1,
      total_price: 1100,
      payment_method: "paypal",
      is_payment_done: true,
      transaction_id: "txn_xyz456"
    }
    // Add more orders as needed
  ];
  
const Orders = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
  
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

  return (
    <>
      <Breadcrumb pageName="Orders" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                  <p className="text-black dark:text-white">{Item.name}</p>
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
               <strong>Discounted Price:</strong> ₹{selectedProduct.displayPrice}
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
                   <strong>Order Date:</strong> {selectedInvoice.delivery_date.toDateString()}
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
                   {selectedInvoice.cancel_order.isCancel ? "Cancelled" : "On Schedule"}
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
               <p className="text-sm text-gray-600 dark:text-gray-300">Discounted Price:</p>
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
      </div>
    </>
  )
}

export default Orders