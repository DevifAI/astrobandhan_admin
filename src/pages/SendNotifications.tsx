import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import UserOne from "../images/user/user-01.png"
import UserTwo from "../images/user/user-02.png"
import UserThree from "../images/user/user-03.png"
import UserFour from "../images/user/user-04.png"
const SendNotifications = () => {

    
    const userData: any[] = [
        {
          profile: UserOne,
          name: 'Pandit Ujjal Shastri',
          contact: '123-456-7890',
          chat_request_time: '10:30 AM',
          chat_request_date: '2024-12-20',
          isRequest_available: true,
        },
        {
          profile: UserTwo,
          name: 'Jane Smith',
          contact: '987-654-3210',
          chat_request_time: '03:45 PM',
          chat_request_date: '2024-12-19',
          isRequest_available: false,
        },
        {
          profile: UserThree,
          name: 'Alice Johnson',
          contact: '456-789-0123',
          chat_request_time: '01:15 PM',
          chat_request_date: '2024-12-18',
          isRequest_available: false,
        },
        {
          profile: UserFour,
          name: 'Bob Brown',
          contact: '321-654-9870',
          chat_request_time: '09:50 AM',
          chat_request_date: '2024-12-17',
          isRequest_available: false,
        },
      ];
      

      
    function getStatusMessage(status: boolean) {
        if (status === true) {
          return <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">Available</p>;
        } else {
          return <p className="text-danger">Not Available</p>;
        }
      }

  return (
    <>
          <Breadcrumb pageName="Send Notifications" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
  {/* Left Section: Chat Button */}
  <div>
    <button
      className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium cursor-not-allowed focus:outline-none"
      disabled
    >
      Chat
    </button>
  </div>

  {/* Right Section: Date Fields */}
  <div className="flex items-center gap-4">
    {/* From Date Field */}
    <div className="flex gap-3 items-center justify-center">
      <label htmlFor="fromDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
        From
      </label>
      <input
        type="date"
        id="fromDate"
        className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
      />
    </div>

    {/* To Date Field */}
    <div className="flex gap-3 items-center justify-center">
      <label htmlFor="toDate" className="text-md font-medium text-gray-600 dark:text-gray-300">
        To 
      </label>
      <input
        type="date"
        id="toDate"
        className="w-full bg-transparent px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white dark:border-gray-700 dark:focus:ring-blue-300"
      />
    </div>
  </div>
</div>

  <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
    <div className="flex items-center px-2 col-span-2 sm:col-span-2">
      <p className="font-medium text-center">Profile</p>
    </div>
    <div className="flex items-center justify-center col-span-1">
      <p className="font-medium text-center">Contact No</p>
    </div>
    <div className="flex items-center justify-center col-span-1 sm:col-span-1">
      <p className="font-medium text-center">Request Time</p>
    </div>
    <div className="flex items-center justify-center col-span-1">
      <p className="font-medium text-center">Request Date</p>
    </div>
    <div className="flex items-center justify-center col-span-1">
      <p className="font-medium text-center">Availability</p>
    </div>
    <div className="flex items-center justify-center col-span-2">
      <p className="font-medium text-center">Actions</p>
    </div>
  </div>

  {/* Table Body */}
  {userData.map((user, key) => (
    <div
      className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
      key={key}
    >
      <div className="flex items-center col-span-2 sm:col-span-2">
        <div className="flex gap-4 justify-center items-center">
          <img src={user.profile} alt="User Profile" className="h-12.5 w-12.5 rounded-full" />
          <p className="text-sm text-black dark:text-white">{user.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-center col-span-1">
        <p className="text-sm text-black dark:text-white">{user.contact}</p>
      </div>
      <div className="flex items-center justify-center col-span-1 sm:col-span-1">
        <p className="text-sm text-black dark:text-white">{user.chat_request_time}</p>
      </div>
      <div className="flex items-center justify-center col-span-1">
        <p className="text-sm text-black dark:text-white">{user.chat_request_date}</p>
      </div>
      <div className="flex items-center justify-center col-span-1">
        <p className="text-sm text-black dark:text-white">{getStatusMessage(user.isRequest_available)}</p>
      </div>
      <div className="flex items-center justify-center col-span-2 space-x-3.5">
      <button
               className="rounded-md bg-blue-300 px-3 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
               >
             Send
              </button>
      </div>
    </div>
  ))}
</div>
    </>      
  )
}

export default SendNotifications
