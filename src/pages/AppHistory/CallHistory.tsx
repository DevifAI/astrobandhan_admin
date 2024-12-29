import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import UserOne from "../../images/user/user-01.png"
import UserTwo from "../../images/user/user-02.png"
import UserThree from "../../images/user/user-03.png"
import UserFour from "../../images/user/user-04.png"

const CallHistory = () => {

    const chatDetails = [
        {
          astrologerImage: UserOne,
          astrologerName: "Astrologer A",
          userImage: UserTwo,
          userName: "User A",
          chatDuration: "30 mins",
          startedTime: "10:00:00",
          endedTime: "10:30:00",
          chatroomId: "CR123456",
          amount: 500,
        },
        {
          astrologerImage: UserThree,
          astrologerName: "Astrologer B",
          userImage: UserOne,
          userName: "User B",
          chatDuration: "45 mins",
          startedTime: "11:00:00",
          endedTime: "11:45:00",
          chatroomId: "CR123457",
          amount: 750,
        },
        {
          userImage: UserTwo,
          astrologerName: "Astrologer C",
          astrologerImage: UserThree,
          userName: "User C",
          chatDuration: "20 mins",
          startedTime: "12:00:00",
          endedTime: "12:20:00",
          chatroomId: "CR123458",
          amount: 300,
        },
        {
            userImage: UserFour,
            astrologerName: "Astrologer D",
            astrologerImage: UserOne,
            userName: "User D",
            chatDuration: "20 mins",
            startedTime: "12:00:00",
            endedTime: "12:20:00",
            chatroomId: "CR123458",
            amount: 300,
          },
      ];

      
  return (
    <>
      <Breadcrumb pageName="Call History" />

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
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="flex items-center px-2 col-span-1 sm:col-span-1">
          <p className="font-medium text-center">Astrologer</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
        <p className="font-medium text-center">User</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Chat Duration</p>
        </div>
        {/* <div className="flex items-center justify-center col-span-2 sm:col-span-2">
          <p className="font-medium text-center">Email</p>
        </div> */}
       
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Started Time</p>
        </div>
        <div className="flex items-center justify-center col-span-1 sm:col-span-1">
          <p className="font-medium text-center">Ended Time</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Total Amount</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Action</p>
        </div>
      </div>
    
      {/* Table Body */}
      {chatDetails.map((user, key) => (
       <div
       className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
       key={key}
     >
       {/* Astrologer Details */}
       <div className="flex items-center col-span-1 sm:col-span-1">
         <div className="flex gap-4 justify-center items-center">
           {/* <img
             src={user.astrologerImage}
             alt="Astrologer Profile"
             className="h-10 w-10 rounded-full"
           /> */}
           <p className="text-sm text-black dark:text-white">
             {user.astrologerName}
           </p>
         </div>
       </div>
       
       {/* User Name */}
       <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <div className="flex gap-4 justify-center items-center ">
           {/* <img
             src={user.userImage}
             alt="Astrologer Profile"
             className="h-10 w-10 rounded-full"
           /> */}
           <p className="text-sm text-black dark:text-white">
             {user.userName}
           </p>
         </div>
       </div>

       
       {/* Chat Duration */}
       <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <p className="text-sm text-black dark:text-white">{user.chatDuration}</p>
       </div>
       
       {/* Reason for Chat */}
       <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <p className="text-sm text-black dark:text-white">{user.startedTime}</p>
       </div>
       
       <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <p className="text-sm text-black dark:text-white">{user.endedTime}</p>
       </div>

       {/* <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <p className="text-sm text-black dark:text-white">{user.chatroomId}</p>
       </div> */}

       <div className="flex items-center justify-center col-span-1 sm:col-span-1">
         <p className="text-sm text-black dark:text-white">{user.amount}</p>
       </div>

       <div className="flex items-center justify-center col-span-1">
  <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Listen</button>
   </div>

          </div>
      ))}
    </div>
    
    </>
  )
}

export default CallHistory
