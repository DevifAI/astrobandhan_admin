import  { useState } from 'react';

const ChatModal = ({ isOpen, onClose, chatData }) => {
  const [messages] = useState([
    {
      sender: 'user',
      message: 'Hi, I have some questions about my career path',
      timestamp: '10:01 AM'
    },
    {
      sender: 'astrologer',
      message: 'Hello! I would be happy to help you with your career-related questions. Could you please share your date of birth and time?',
      timestamp: '10:02 AM'
    },
    {
      sender: 'user',
      message: '15th March 1990, 3:30 PM',
      timestamp: '10:02 AM'
    },
    {
      sender: 'astrologer',
      message: 'Thank you. I can see that Jupiter is well-placed in your chart, which is excellent for career growth. What specific aspects of your career would you like to discuss?',
      timestamp: '10:03 AM'
    },
    {
      sender: 'user',
      message: "I'm considering a career change. Should I switch industries or stay in my current field?",
      timestamp: '10:04 AM'
    }, {
      sender: 'user',
      message: '15th March 1990, 3:30 PM',
      timestamp: '10:02 AM'
    },
    {
      sender: 'astrologer',
      message: 'Thank you. I can see that Jupiter is well-placed in your chart, which is excellent for career growth. What specific aspects of your career would you like to discuss?',
      timestamp: '10:03 AM'
    },
    {
      sender: 'user',
      message: "I'm considering a career change. Should I switch industries or stay in my current field?",
      timestamp: '10:04 AM'
    }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-boxdark w-full max-w-2xl rounded-lg shadow-lg flex flex-col mt-10 md:mt-0 h-[80vh] sm:h-[85vh] ">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-strokedark shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white">Chat History</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 scrollbar-hide"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg ml-4'
                    : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-r-lg rounded-bl-lg mr-4'
                } p-2.5 sm:p-3 shadow-sm`}
              >
                <p className="text-sm break-words">{msg.message}</p>
                <span className={`text-xs mt-1 block ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t dark:border-strokedark shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              disabled
              placeholder="Chat history is read-only"
              className="w-full px-3 sm:px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed text-sm"
            />
            <button
              disabled
              className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;