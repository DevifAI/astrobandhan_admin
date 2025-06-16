import { useState, useEffect, useCallback, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

interface IAstrologer {
  _id: string;
  name: string;
  avatar: string;
  specialities: string[];
  experience: number;
  isVerified: boolean;
  pricePerChatMinute: number;
  pricePerCallMinute: number;
  rating: number;
  isAvailable: boolean;
  isFeatured: boolean;
  walletBalance?: number;
  gender?: string;
}

const ManageAIAstrologer = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAstrologer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IAstrologer[]>([]);
  const [allUsers, setAllUsers] = useState<IAstrologer[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [newUser, setNewUser] = useState<Omit<IAstrologer, '_id'>>({
    name: '',
    avatar: '',
    specialities: [],
    experience: 0,
    isVerified: false,
    pricePerChatMinute: 0,
    pricePerCallMinute: 0,
    rating: 0,
    isAvailable: true,
    isFeatured: false,
    gender: ''
  });

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.post('/admin/get/all/ai/astrologers');
        setAllUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch astrologers');
      }
    };

    fetchUsers();
  }, []);

  // Custom debounce function for search
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const filtered = allUsers.filter(
          (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredUsers(filtered);
        setCurrentPage(0);
      }, 300);
    },
    [allUsers],
  );

  // Trigger debounced search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debouncedSearch]);

  // Handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Pagination logic
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleAddAstrologer = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (user: IAstrologer) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    setSelectedUser(allUsers.find(user => user._id === userId) || null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await axiosInstance.post('/admin/delete/ai/astrologer', {
        astrologer_ai_id: selectedUser._id,
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Astrologer deleted successfully!');
        setIsDeleteModalOpen(false);

        const updatedUsers = allUsers.filter(user => user._id !== selectedUser._id);
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        toast.error(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting astrologer:', error);
      toast.error('Failed to delete astrologer');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await axiosInstance.post(
        `/admin/edit/ai/astrologer/${selectedUser._id}`,
        selectedUser,
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Astrologer updated successfully!');
        setIsEditModalOpen(false);

        const updatedUsers = allUsers.map(user =>
          user._id === selectedUser._id ? response.data.data : user,
        );
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        toast.error(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error updating astrologer:', error);
      toast.error('Failed to update astrologer');
    }
  };

  const CLOUDINARY_CLOUD_NAME = 'dlol2hjj8';

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedUser) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'admin_photos_user');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );
      setSelectedUser(prev => ({
        ...prev!,
        avatar: response.data.secure_url,
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'admin_photos_user');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );
      setNewUser(prev => ({
        ...prev,
        avatar: response.data.secure_url,
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleAddAstrologerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedSpecialities = newUser.specialities.filter(speciality => speciality.trim() !== "");
    const updatedNewUser = { ...newUser, specialities: cleanedSpecialities };

    if (!updatedNewUser.gender || updatedNewUser.gender === "") {
      return toast.error("Gender is required");
    }

    try {
      const response = await axiosInstance.post('/admin/add/ai/astrologer', updatedNewUser);

      if (response.data.success) {
        toast.success(response.data.message || 'AI Astrologer added successfully!');
        setIsAddModalOpen(false);

        const updatedUsers = [...allUsers, response.data.data];
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        // Reset form
        setNewUser({
          name: '',
          avatar: '',
          specialities: [],
          experience: 0,
          isVerified: false,
          pricePerChatMinute: 0,
          pricePerCallMinute: 0,
          rating: 0,
          isAvailable: true,
          isFeatured: false,
          gender: ''
        });
      } else {
        toast.error(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error adding astrologer:', error);
      toast.error('Failed to add astrologer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && inputValue.trim()) {
      e.preventDefault();
      if (isEditModalOpen && selectedUser) {
        setSelectedUser({
          ...selectedUser,
          specialities: [...selectedUser.specialities, inputValue.trim()],
        });
      } else {
        setNewUser({
          ...newUser,
          specialities: [...newUser.specialities, inputValue.trim()],
        });
      }
      setInputValue('');
    }
  };

  return (
    <>
      <Breadcrumb pageName="AI Astrologers" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div>
            <form action="#" method="POST">
              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                      fill=""
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              className="rounded-md bg-blue-300 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
              onClick={handleAddAstrologer}
            >
              Add AI Astrologer
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-2 sm:col-span-2">
            <p className="font-medium text-center">Profile</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Experience</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Specialities</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Wallet Balance</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Verified</p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium text-center">Actions</p>
          </div>
        </div>

        {/* Table Body */}
        {currentUsers.length > 0 ? (
          currentUsers.map((user, key) => (
            <div
              className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              key={key}
            >
              {/* Profile */}
              <div className="flex items-center col-span-2 sm:col-span-2">
                <div className="flex gap-4 items-center relative">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  <p className="text-sm text-black dark:text-white">
                    {user.name}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center justify-center col-span-1">
                <p className="text-sm text-black dark:text-white">
                  {user.experience} years
                </p>
              </div>

              {/* Specialities */}
              <div className="flex items-center justify-center col-span-1">
                <p className="text-sm text-black dark:text-white">
                  {user.specialities.join(', ')}
                </p>
              </div>

              {/* Wallet Balance */}
              <div className="flex items-center justify-center col-span-1">
                <p className="text-sm text-black dark:text-white">
                  ${user.walletBalance || 0}
                </p>
              </div>

              {/* Verified */}
              <div className="flex items-center justify-center col-span-1">
                <p className="text-sm text-black dark:text-white">
                  {user.isVerified ? 'Yes' : 'No'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center col-span-2 space-x-3.5">
                <button
                  className="hover:text-primary"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit className="text-blue-500" size={18} />
                </button>
                <button
                  className="hover:text-primary"
                  onClick={() => handleDelete(user._id)}
                >
                  <FaTrash className="text-red-500" size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center col-span-full">
            <p className="text-gray-500">No astrologers found</p>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center py-6">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'flex space-x-2'}
              pageClassName={
                'px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400'
              }
              activeClassName={'bg-blue-300 dark:bg-blue-400 text-white'}
              previousClassName={
                'px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400'
              }
              nextClassName={
                'px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400'
              }
              disabledClassName={'opacity-50 cursor-not-allowed'}
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-4xl mx-4 landscape-modal">
            <h2 className="text-xl font-semibold mb-4">Edit AI Astrologer</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Avatar Image and Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Avatar
                  </label>
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  )}
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedUser.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedUser.experience}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        setSelectedUser({
                          ...selectedUser,
                          experience: value,
                        });
                      }
                    }}
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Specialities */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Specialities <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border border-stroke rounded-md"
                    placeholder="Add a speciality"
                  />
                  <div className="flex flex-wrap gap-2 my-2">
                    {selectedUser.specialities.map((speciality, index) => (
                      <div key={index} className="flex items-center bg-gray-200 p-2 rounded-md">
                        <span>{speciality}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => {
                            setSelectedUser({
                              ...selectedUser,
                              specialities: selectedUser.specialities.filter((item) => item !== speciality),
                            });
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={selectedUser.rating}
                    disabled
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Price Per Chat Minute */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Chat Minute
                  </label>
                  <input
                    type="number"
                    value={selectedUser.pricePerChatMinute || 0}
                    min={0}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        pricePerChatMinute: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Verified */}
                <div>
                  <label className="block text-sm font-medium mb-1">is Verified</label>
                  <select
                    value={selectedUser.isVerified ? 'Yes' : 'No'}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isVerified: e.target.value === "Yes",
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* isAvailable */}
                <div>
                  <label className="block text-sm font-medium mb-1">is Available?</label>
                  <select
                    value={selectedUser.isAvailable ? "Yes" : "No"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isAvailable: e.target.value === "Yes",
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                {/* is Trending */}
                <div>
                  <label className="block text-sm font-medium mb-1">is Trending ?</label>
                  <select
                    value={selectedUser.isFeatured ? "Yes" : "No"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isFeatured: e.target.value === "Yes",
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={selectedUser.gender || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        gender: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Astrologer</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedUser.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Astrologer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-4xl mx-4 landscape-modal">
            <h2 className="text-xl font-semibold mb-4">Add AI Astrologer</h2>
            <form onSubmit={handleAddAstrologerSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Avatar Image and Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Avatar</label>
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  )}
                  <div className="flex items-center space-x-4">
                    <img
                      src={newUser.avatar || "/default-avatar.png"}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newUser.experience}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        experience: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Specialities */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Specialities <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border border-stroke rounded-md"
                    placeholder="Add a speciality"
                  />
                  <div className="flex flex-wrap gap-2 my-2">
                    {newUser.specialities.map((speciality, index) => (
                      <div key={index} className="flex items-center bg-gray-200 p-2 rounded-md">
                        <span>{speciality}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => {
                            setNewUser({
                              ...newUser,
                              specialities: newUser.specialities.filter((item) => item !== speciality),
                            });
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={newUser.rating}
                    onChange={(e) => setNewUser({
                      ...newUser, 
                      rating: Number(e.target.value)
                    })}
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Price Per Chat Minute */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Chat Minute
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newUser.pricePerChatMinute}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        pricePerChatMinute: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  />
                </div>

                {/* Verified */}
                <div>
                  <label className="block text-sm font-medium mb-1">Verified</label>
                  <select
                    value={newUser.isVerified ? "Yes" : "No"}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        isVerified: e.target.value === "Yes",
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={newUser.gender || ""}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        gender: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-stroke rounded-md"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Add Astrologer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default ManageAIAstrologer;