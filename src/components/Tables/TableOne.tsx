import { BRAND } from '../../types/brand';
import UserOne from "../../images/user/user-01.png"
import UserTwo from "../../images/user/user-02.png"
import UserThree from "../../images/user/user-03.png"
import UserFour from "../../images/user/user-04.png"

const brandData: BRAND[] = [
  {
    logo: UserOne,
    name: 'Sayan Paul',
    visitors: 7894561230,
    revenues: 200,
    sales: 5,
    conversion: 4.8,
  },
  {
    logo: UserTwo,
    name: 'Ujjal Shastri',
    visitors: 7894561230,
    revenues: 200,
    sales: 5,
    conversion: 4.3,
  },
  {
    logo: UserThree,
    name: 'Jane Smith',
    visitors: 7894561230,
    revenues: 200,
    sales: 5,
    conversion: 3.7,
  },
  {
    logo: UserFour,
    name: 'Jane Smith',
    visitors: 7894561230,
    revenues: 400,
    sales: 5,
    conversion: 2.5,
  },
  {
    logo: UserFour,
    name: 'Jane Smith',
    visitors: 7894561230,
    revenues: 200,
    sales: 5,
    conversion: 4.2,
  },
];

const TableOne = () => {
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

        {brandData.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === brandData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0 w-10 h-10">
                <img src={brand.logo} alt="Brand " className='w-full h-full' />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {brand.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.visitors}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 text-center">
              <p className="text-meta-3">{brand.revenues}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{brand.sales}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
