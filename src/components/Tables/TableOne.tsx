import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { BRAND } from '../../types/brand';
import UserOne from "../../images/user/user-01.png";
import UserTwo from "../../images/user/user-02.png";
import UserThree from "../../images/user/user-03.png";
import UserFour from "../../images/user/user-04.png";

// Add type for the brand data.
type AstrologerData = {
  astrologerId: string;
  name: string;
  avatar: string;
  totalCalls: number;
  totalChats: number;
  revenue: number;
};

const TableOne = () => {
  const [astrologers, setAstrologers] = useState<AstrologerData[]>([]);

  useEffect(() => {
    const fetchTopAstrologers = async () => {
      try {
        const response = await axiosInstance.post('/admin/top/astrologers');
        // console.log("API Response: ", response.data); // Log the API response
        if (response.data.success && response.data.data) {
          // Update state with the fetched astrologers
          setAstrologers(response.data.data.map((astrologer: any) => ({
            astrologerId: astrologer.astrologerId,
            name: astrologer.name,
            avatar: astrologer.avatar,
            totalCalls: astrologer.totalCalls,
            totalChats: astrologer.totalChats,
            revenue: astrologer.totalCalls * astrologer.pricePerCallMinute + astrologer.totalChats * astrologer.pricePerChatMinute // Calculate revenue from calls and chats
          })));
        }
      } catch (error) {
        console.error('Error fetching top astrologers:', error);
      }
    };

    fetchTopAstrologers();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        This Week Top Astrologers ⭐
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Profile
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Contact
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Revenue
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Request
            </h5>
          </div>
        </div>

        {astrologers.map((astrologer, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${key === astrologers.length - 1
              ? ''
              : 'border-b border-stroke dark:border-strokedark'
              }`}
            key={astrologer.astrologerId}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0 w-10 h-10">
                <img src={astrologer.avatar} alt={astrologer.name} className='w-full h-full' />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {astrologer.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{astrologer.totalCalls + astrologer.totalChats}</p> {/* Total requests */}
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 text-center">
              <p className="text-meta-3">{astrologer.revenue}</p> {/* Revenue */}
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{astrologer.totalCalls + astrologer.totalChats}</p> {/* Total requests */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
