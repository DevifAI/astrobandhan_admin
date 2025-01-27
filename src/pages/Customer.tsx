import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import UserOne from "../images/user/user-01.png";
import UserTwo from "../images/user/user-02.png";
import UserThree from "../images/user/user-03.png";
import UserFour from "../images/user/user-04.png";
import { CustomerType } from "../types/customer";
import RechargeWalletModal from "../modals/RechargeWallet";
import axiosInstance from "../utils/axiosInstance";
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import AddCustomerModal from "./AddCustomerModal";


const Customer = () => {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isRechargeDone, setIsRechargeDone] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddCustomerAdded, setIsAddCustomerAdded] = useState({ status: false, message: "" });

  const [users, setUsers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");  // Added search state
  const [selectedUser, setSelectedUser] = useState<CustomerType | null>(null); // Modal state for selected user

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // You can adjust the number of users per page.

  // Fetch users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.post("/admin/get/users");
        // console.log(response.data);
        setUsers(response.data.data); // Set the fetched users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isRechargeModalOpen, isAddCustomerModalOpen]); // Dependency on `isRechargeModalOpen`

  // Filter users by name based on the search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  // Handle click on eye button to open the user details modal
  const handleViewUserDetails = (user: CustomerType) => {
    setSelectedUser(user); // Set the selected user for modal display
  };

  // Close the user details modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };


  useEffect(() => {
    if (isRechargeDone) {
      toast.success("Recharge Done");
    }
    // console.log({isAddCustomerAdded})
    if (isAddCustomerAdded.status && !isAddCustomerAdded.message !== "") {
      // console.log({isAddCustomerAdded})
      toast.error(isAddCustomerAdded.message);
    }
    // if (!isAddCustomerAdded.status && !isAddCustomerAdded.message.trim() !== "") {
    //   console.log({isAddCustomerAdded})
    //   toast.success(isAddCustomerAdded.message);
    // }
    setIsAddCustomerAdded({ status: false, message: "" })
    setIsRechargeDone(false);
  }, [isRechargeDone, isAddCustomerModalOpen]);

  return (
    <>
      <Breadcrumb pageName="Customers" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div>
            <form action="#" method="POST">
              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
              onClick={() => setIsRechargeModalOpen(true)}
            >
              Recharge Wallet
            </button>

            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
            >
              Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-2 sm:col-span-2">
            <p className="font-medium text-center">Profile</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Contact No</p>
          </div>
          <div className="flex items-center justify-center col-span-2 sm:col-span-2">
            <p className="font-medium text-center">Email</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Birth Date</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Birth Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Wallet Balance</p>
          </div>
        </div>

        {/* Table Body */}
        {currentUsers.map((user, key) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="flex items-center col-span-2 sm:col-span-2">
              <div className="flex gap-4 justify-center items-center">
                <img src={user.photo} alt="User Profile" className="h-12.5 w-12.5 rounded-full" />
                <p className="text-sm text-black dark:text-white">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">{user.phone}</p>
            </div>
            <div className="flex items-center justify-center col-span-2 sm:col-span-2">
              <p className="text-sm text-black dark:text-white">{user.email}</p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">{user.dateOfBirth}</p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">
                {user.timeOfBirth !== "null:null PM" ? user.timeOfBirth : "-"}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1 space-x-3.5">
              <p className="text-sm text-black dark:text-white">
                {user.walletBalance}
              </p>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <AddCustomerModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
          setIsAddCustomerAdded={setIsAddCustomerAdded}
        />


        <RechargeWalletModal
          isOpen={isRechargeModalOpen}
          users={users}
          onClose={() => setIsRechargeModalOpen(false)}
          setIsRechargeDone={setIsRechargeDone}
        />

      </div>

      <div className="flex justify-center py-4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={"flex flex-row space-x-2"} // Use flex-row for horizontal layout
          pageClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for each page item
          pageLinkClassName={"page-link"}
          previousClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for previous button
          nextClassName={"px-3 py-1 border border-stroke rounded-md text-black dark:text-white hover:bg-blue-300 dark:hover:bg-blue-400"} // Style for next button
          activeClassName={"bg-blue-300 dark:bg-blue-400 text-white"} // Style for active page
        />
      </div>
      <Toaster />
    </>
  );
};

export default Customer;
