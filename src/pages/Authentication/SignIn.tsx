import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);

  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => password.length >= 8;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axiosInstance.post("/admin/login", {
          email,
          password,
        });
        const token = response.data.data?.accessToken;
        if (token) {
          localStorage.setItem("User", token);
          navigate("/")
        } else {
          setErrors({ password: "Login failed. Please try again." });
        }
      } catch (error: any) {
        toast.error("Invalid Credentials.", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
      }
    }
  };

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      // setErrors({ email: "Please enter a valid 10-digit phone number." });
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/forgot-password", { phone: phoneNumber, role: "admin" });
      if (response.data.success) {
        setIsOtpSent(true);
        setVerificationId(response.data.data.data.verificationId);
        toast.success("OTP Sent", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
      } else {
        toast.error("Failed to send OTP. Please try again.", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
        // setErrors({ email: "Failed to send OTP. Please try again." });
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      // setErrors({ email: "An error occurred. Please try again later." });
      toast.error("An error occurred. Please try again later.", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      // setErrors({ password: "Please enter a valid 4-digit OTP." });
      toast.error("Please enter a valid 4-digit OTP.", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/validate-otp", { phone: phoneNumber, code: otp, verificationId });
      if (response.data.success) {
        toast.success("OTP Verfied Successfully", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
        setIsPasswordReset(true); // Show the password reset form
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });

      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      // setErrors({ password: "An error occurred. Please try again later." });
      toast.error("Something Went Wrong", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      // setErrors({ password: "Passwords do not match." });
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 8 characters long.", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      // setErrors({ password: "Password must be at least 8 characters long." });
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/change-password", {
        phone: phoneNumber,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password Reset Successfully", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
        setIsResetPassword(false);
        setIsPasswordReset(false);
        setPhoneNumber("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error("Failed to reset password.", {
          position: 'top-center',
          duration: 3000, // Automatically close the toast after 3 seconds
        });
        // setErrors({ password: "Failed to reset password. Please try again." });
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error("Something Went Wrong", {
        position: 'top-center',
        duration: 3000, // Automatically close the toast after 3 seconds
      });
      // setErrors({ password: "An error occurred. Please try again later." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black relative">
      {/* Gradient circles */}

      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-500 to-white rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-green-500 to-white rounded-full opacity-30 blur-2xl"></div>

      <div className="w-full max-w-sm px-6 py-8 bg-white/30 backdrop-blur-md shadow-lg rounded-lg">
        {!isResetPassword ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
              <p className="text-sm text-gray-200 mb-6">
                Please enter your email and password to sign in.
              </p>
            </div>

            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.email ? "border-red-500" : "focus:border-green-500"
                    }`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "focus:border-green-500"
                    }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-200 focus:outline-none"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-200">
                Need to reset your password?{" "}
                <button
                  onClick={() => setIsResetPassword(true)}
                  className="text-green-400 hover:underline"
                >
                  Reset Password
                </button>
              </p>
              <p className="text-sm text-gray-200 mt-2">
                Or{" "}
                <button
                  onClick={() => toast.error("Contact Developer")}
                  className="text-green-400 hover:underline"
                >
                  Login with OTP
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">Reset Password</h2>
              <p className="text-sm text-gray-200 mb-6">
                {isPasswordReset
                  ? "Enter your new password."
                  : isOtpSent
                    ? "Enter the OTP sent to your phone."
                    : "Enter your phone number to reset your password."}
              </p>
            </div>

            {!isPasswordReset ? (
              !isOtpSent ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.email ? "border-red-500" : "focus:border-green-500"
                        }`}
                      placeholder="Enter your phone number"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <button
                    onClick={handleSendOtp}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none"
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-200">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "focus:border-green-500"
                        }`}
                      placeholder="Enter the OTP"
                      required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none"
                  >
                    Verify OTP
                  </button>
                </>
              )
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "focus:border-green-500"
                      }`}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-200">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "focus:border-green-500"
                      }`}
                    placeholder="Confirm new password"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <button
                  onClick={handleResetPassword}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none"
                >
                  Reset Password
                </button>
              </>
            )}


            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsResetPassword(false);
                  setIsPasswordReset(false);
                  setIsOtpSent(false);
                }}
                className="text-green-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default SignIn;