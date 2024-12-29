import { useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import UserOne from "../../images/user/user-01.png"
import UserTwo from "../../images/user/user-02.png"
import UserThree from "../../images/user/user-03.png"
import UserFour from "../../images/user/user-04.png"
import AddAstrologerModal from "../../components/Modals/AddAstrologer"



const userData: AstrologerType[] = [
    {
      image: UserOne,
      name: 'Pandit Ujjal Shastri',
      contactNo: '123-456-7890',
      gender: 'Male',
      isVerified: true,
      chatRequest: 5,
      callRequest: 3,
    },
    {
      image: UserTwo,
      name: 'Jane Smith',
      contactNo: '987-654-3210',
      gender: 'Female',
      isVerified: false,
      chatRequest: 2,
      callRequest: 1,
    },
    {
      image: UserThree,
      name: 'Alice Johnson',
      contactNo: '456-789-0123',
      gender: 'Female',
      isVerified: true,
      chatRequest: 10,
      callRequest: 7,
    },
    {
      image: UserFour,
      name: 'Bob Brown',
      contactNo: '321-654-9870',
      gender: 'Male',
      isVerified: false,
      chatRequest: 0,
      callRequest: 0,
    },
  ];

const ManageAstrologer = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAstrologer = (data: AstrologerFormData) => {
    // Handle the form submission here
    console.log('New Astrologer Data:', data);
    // Add your logic to save the data
  };

    function getStatusMessage(status: boolean) {
        if (status === true) {
          return <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">Verified</p>;
        } else {
          return <p className="text-danger">Unverified</p>;
        }
      }

    return (
        <>
          <Breadcrumb pageName="Astrologers" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
           <div className="">
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
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                        fill=""
                      />
                    </svg>
                  </button>
    
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                  />
                </div>
              </form>
            </div> 
    
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                   className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                   >
                  Add Astrologer
                  </button>
                  <button
                   className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                   >
                  CSV
                  </button>
                  <button
                   className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                   >
                  PDF
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
        {/* <div className="flex items-center justify-center col-span-2 sm:col-span-2">
          <p className="font-medium text-center">Email</p>
        </div> */}
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Gender</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium text-center">Total Request</p>
        </div>
        <div className="flex items-center justify-center col-span-2 sm:col-span-2">
          <p className="font-medium text-center">Satus</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
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
              <img src={user.image} alt="User Profile" className="h-12.5 w-12.5 rounded-full" />
              <p className="text-sm text-black dark:text-white">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="text-sm text-black dark:text-white">{user.contactNo}</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="text-sm text-black dark:text-white">{user.gender}</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="text-sm text-black dark:text-white flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>
                {user.callRequest} /
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg> {user.chatRequest}
 </p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="text-md text-black dark:text-white">{getStatusMessage(user.isVerified)}</p>
          </div>
          <div className="flex items-center justify-center col-span-1 space-x-3.5">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                              fill=""
                            />
                            <path
                              d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button className="hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
                        </button>
                      </div>  
          </div>
        </div>
      ))}
    </div>
    
    <AddAstrologerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAstrologer}
      />
    
        </>
      )
}

export default ManageAstrologer
