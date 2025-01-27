import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const ChatModal = ({ isOpen, onClose, chatData }) => {
  const [messages, setMessages] = useState([]);

  // Fetch chat history
  useEffect(() => {
    if (isOpen && chatData?.chatRoomId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axiosInstance.post('/admin/get/chat/details/history', {
            chatRoomId: chatData.chatRoomId,
          });
          setMessages(response.data[0]?.messages || []);
        } catch (error) {
          console.error('Error fetching chat history', error);
        }
      };
      fetchChatHistory();
    }
  }, [isOpen, chatData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-999">
      <div className="bg-white dark:bg-boxdark w-full max-w-2xl rounded-lg shadow-lg flex flex-col mt-10 md:mt-0 h-[80vh] sm:h-[85vh]">
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
  className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4"
  style={{
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollbarColor: 'transparent transparent',
  }}
>
  {messages.map((msg, index) => (
    <div
    key={index}
    className={`flex ${
      msg.senderType === 'user' && msg.messageType !== 'userjoined'
        ? 'justify-end' // Align user messages to the right
        : msg.senderType === 'astrologer'
        ? 'justify-start' // Align astrologer messages to the left
        : 'justify-center' // Align system messages (e.g., userjoined) to the center
    } items-end gap-2`}
  >
    {/* Avatar for astrologer */}
    {msg.senderType === 'astrologer' && (
      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
        🔮
      </div>
    )}
  
    {/* Message Bubble */}
    <div
      className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg ${
        msg.senderType === 'user' && msg.messageType !== 'userjoined'
          ? 'bg-blue-500 text-white rounded-br-sm' // User message style
          : msg.senderType === 'astrologer'
          ? 'bg-purple-500 text-white rounded-bl-sm' // Astrologer message style
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg' // System message style
      } shadow-sm`}
    >
      {/* Handle message type */}
      {msg.messageType === 'text' ? (
        <p className="text-sm break-words">{msg.message}</p>
      ) : msg.messageType === 'image' ? (
        <img
          src={msg.message}
          alt="message image"
          className="max-w-full rounded-md"
        />
      ) : msg.messageType === 'userjoined' ? (
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          {msg.message}
        </p>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Unsupported message type
        </p>
      )}
      {/* Timestamp */}
      {msg.messageType !== 'userjoined' && (
        <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  
    {/* Avatar for user */}
    {msg.senderType === 'user' && msg.messageType !== 'userjoined' && (
      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">
        👤
      </div>
    )}
  </div>
  ))}
</div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t dark:border-strokedark shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-center w-full">Chat history is read-only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
