import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import UserOne from "../../images/user/user-01.png"
import UserTwo from "../../images/user/user-02.png"
import UserThree from "../../images/user/user-03.png"
import UserFour from "../../images/user/user-04.png"


const Pending = () => {

    // Create the UserDate array
    const userData = [
      {
        profile: UserOne,
        name: 'John Doe',
        contact: '123-456-7890',
        date: '2024-12-23',
        amount: '100.00',
        status: true
      },
      {
        profile: UserTwo,
        name: 'Jane Smith',
        contact: '987-654-3210',
        date: '2024-12-22',
        amount: '200.00',
        status: true
      },
      {
        profile: UserThree,
        name: 'Alice Johnson',
        contact: '456-789-0123',
        date: '2024-12-21',
        amount: '150.00',
        status: true
      },
      {
        profile: UserFour,
        name: 'Alice Smith',
        contact: '456-789-0123',
        date: '2024-12-21',
        amount: '150.00',
        status: false
      }
    ];
  

    return (
      
      <>
        <Breadcrumb pageName="Pending Request" />
  
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
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
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium text-center">Contact No</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Date</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Amount</p>
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
            <div className="flex items-center justify-center col-span-2">
              <p className="text-sm text-black dark:text-white">{user.contact}</p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">{user.date}</p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">{user.amount}</p>
            </div>
            <div className="flex items-center justify-center col-span-2">
  <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Pay Now</button>
  <button className="px-3 py-2 ml-4 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
</div>

          </div>
        ))}
      
      </div>
      </>
    );
  };
  
  export default Pending;