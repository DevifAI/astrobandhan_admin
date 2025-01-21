import React from "react";

const ComingSoon = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col  justify-center items-center">
      <h1 className="text-4xl font-bold text-white">Coming Soon</h1>
      <p className="mt-4 text-lg text-gray-600">
        We're working hard to bring this feature to you!
      </p>
      {/* <div className="mt-6">
        <img
          src="https://via.placeholder.com/400x300?text=Coming+Soon"
          alt="Coming Soon Illustration"
          className="rounded shadow-md"
        />
      </div> */}
    </div>
    </div>
  );
};

export default ComingSoon;