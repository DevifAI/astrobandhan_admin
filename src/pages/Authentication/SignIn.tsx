import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axiosInstance from '../../utils/axiosInstance';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8; // Password must be at least 8 characters long
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: { email?: string; password?: string } = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axiosInstance.post('/admin/login', {
          email,
          password,
        });
  
        console.log('API Response:', response.data); // Debugging the response
  
        const token = response.data.data?.accessToken; // Adjust this based on the actual response structure
        if (token) {
          localStorage.setItem('User', token); // Store the token in localStorage
          navigate('/'); // Navigate to the home page
        } else {
          console.error('Access token not found in the response');
          setErrors({
            email: '',
            password: 'Login failed. Please try again.', // Customize error message
          });
        }
      } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        setErrors({
          email: '',
          password: 'Invalid email or password.', // Customize error message
        });
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <p className="text-black text-2xl lg:text-4xl font-bold text-center">
              RUDRA <br /> GANGA
            </p>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">Please enter your email and password to sign in.</p>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.email ? 'border-red-500' : 'focus:border-blue-500'
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.password ? 'border-red-500' : 'focus:border-blue-500'
              }`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none top-5"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;