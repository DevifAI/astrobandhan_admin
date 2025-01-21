import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';

const SignIn: React.FC = () => {
  const [step, setStep] = useState(1); // Step 1: Enter Mobile, Step 2: Enter OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation or API call to send OTP here
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation or API call to verify OTP here
    console.log('Mobile:', mobileNumber, 'OTP:', otp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <img src={LogoDark} className="h-16" alt="AppName Logo" />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {step === 1 ? 'Enter Your Mobile Number' : 'Verify Your OTP'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {step === 1
              ? 'We will send an OTP to your mobile number.'
              : `Enter the OTP sent to ${mobileNumber}`}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleMobileSubmit}>
            <div className="mb-4">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter mobile number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 py-2 px-4 text-blue-500 bg-transparent border border-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none"
            >
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;