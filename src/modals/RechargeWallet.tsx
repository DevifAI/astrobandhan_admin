import React, { useState, useCallback, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';


interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: { _id: string; name: string; email: string; }[];  // Adjusted users data structure
  setIsRechargeDone: any
}

const allowedAmounts = [25, 50, 100, 199, 500, 1000, 2000, 3000, 5000]; // Allowed amounts

const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({ isOpen, onClose, users, setIsRechargeDone }) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');  // Now this will store the selected amount
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [amountError, setAmountError] = useState<string>(''); // Error message for amount
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const filtered = users
        .filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Search in 'name' field
        )
        .map(user => user.name);  // Only return the 'name' for suggestions
      setSuggestions(filtered);
    }, 300);
  }, [users]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 0) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    setSuggestions([]);
  };

  // Handle amount change (for dropdown)
  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAmount(value);
  };


  const handleRecharge = async () => {
    const selectedUser = users.find(user => user.name === name);
    if (!selectedUser) {
      toast.error('User not found', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')}T${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

    // Prepare payload
    const payload = {
      userId: selectedUser._id,  // Assuming _id is used as userId
      transaction_id: `admin_TXN_${selectedUser._id}_${formattedDateTime}`,  // Transaction ID with admin prefix + formatted date & time
      amount: Number(amount), // The amount entered
      amount_type: 'credit', // Hardcoded value as 'credit'
    };


    try {
      // Send POST request to the server using axiosInstance
      const response = await axiosInstance.post('/user/add/balance', payload);

      // Handle success
      // console.log({ response })
      // console.log(response.data)
      // console.log(response.data.statusCode)
      if (response.data.statusCode === 201 || response.data.statusCode === 200) {
        // toast.success("done")
        setIsRechargeDone(true)
        onClose(); // Close the modal
      } else {
        toast.error('Failed to recharge wallet', {
          position: 'top-center',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Error occurred while recharging', {
        position: 'top-center',
        duration: 3000,
      });
      console.error(error); // Log error for debugging
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal header */}
        <h2 className="text-2xl font-semibold mb-4">Recharge Wallet</h2>

        {/* Modal form */}
        <form className="space-y-4">
          {/* Name input with suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <select
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select amount</option>
              {allowedAmounts.map((amountValue, index) => (
                <option key={index} value={amountValue}>
                  {amountValue}
                </option>
              ))}
            </select>
            {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>} {/* Error message */}
          </div>

          {/* Form buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleRecharge()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Recharge
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default RechargeWalletModal;
