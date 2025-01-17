import React, { useState, useCallback, useRef, useEffect } from 'react';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy names for suggestions
const dummyNames: string[] = [
  'John Smith',
  'Emma Wilson',
  'Michael Brown',
  'Sarah Davis',
  'James Johnson',
  'Lisa Anderson',
  'David Miller',
  'Jennifer Taylor',
  'Robert Wilson',
  'Emily White'
];

const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const filtered = dummyNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    }, 300);
  }, []);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted:', { name, amount });
    setName('');
    setAmount('');
    onClose();
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
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Recharge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechargeWalletModal;