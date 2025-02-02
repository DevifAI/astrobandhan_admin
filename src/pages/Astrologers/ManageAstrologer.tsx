import { useState, useEffect, useCallback, useRef } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons from react-icons
import ReactPaginate from "react-paginate";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Select from "react-select";

const ITEMS_PER_PAGE = 10; // Number of items per page

const ManageAIAstrologer = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for editing
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]); // Holds the filtered users for display
  const [allUsers, setAllUsers] = useState([]); // Holds all users fetched from the API
  const [currentPage, setCurrentPage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for storing the timeout ID
  const [currentStep, setCurrentStep] = useState(1)
  const [inputValue, setInputValue] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [languages, setLangugaes] = useState([])
  const [astro_Category, setAstro_Category] = useState([])
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append('excel_astrologer', file);

    // Use toast.promise to handle the file upload process
    toast.promise(
      axiosInstance.post('/admin/signup/astrologer/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      {
        loading: 'Uploading file...', // Loading message
        success: (response) => {
          if (response.data.statusCode === 200 || response.data.statusCode === 201) {
            // Reset the file input
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input
            }
            fetchUsers()
            return 'File uploaded successfully!'; // Success message
          } else {
            // Reset the file input
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input
            }
            return 'File upload failed!'; // Failure message
          }
        },
        error: (error) => {
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
          }

          if (error.response) {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input
            }

            return error.response.data.message || 'File upload failed. Please try again.'; // Error message from backend
          } else {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input
            }
            return 'File upload failed. Please try again.'; // Generic error message
          }
        },
      }
    );
  };

  // Trigger file input click
  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };


  const [newUser, setNewUser] = useState({
    name: "",
    avatar: "",
    specialities: [],
    experience: 0,
    isVerified: false,
    pricePerChatMinute: 0,
    pricePerCallMinute: 0,
    pricePerVideoCallMinute: 0,
    isFeatured: false,
    chatCommission: 0,
    callCommission: 0,
    videoCallCommission: 0,
    rating: 0,
    password: "",
    confirmPassword: "",
    isAvailable: false,
    specialites: []


  })

  // Convert languages into options for react-select
  const languageOptions = languages.map((lang) => ({
    value: lang._id,
    label: lang.name,
  }));

  const categoryOptions = astro_Category.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.post("/admin/getastrologers");
      // console.log(response.data);
      setAllUsers(response.data.data.astrologers); // Store all users
      setFilteredUsers(response.data.data.astrologers); // Initialize filtered users with all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users from the API
  useEffect(() => {

    const fetchLangugaes = async () => {
      try {
        const response = await axiosInstance.post("/admin/get/languages");
        // const languageNames = response.data.data.map(language => language.name);
        setLangugaes(response.data.data); // Save only the names in the state
        // setAllUsers(response.data.data.astrologers); // Store all users
        // setFilteredUsers(response.data.data.astrologers); // Initialize filtered users with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchAstro_Categories = async () => {
      try {
        const response = await axiosInstance.post("/admin/get/astrologer/category");
        // console.log({ response })
        if (response.data.statusCode === 200) {
          setAstro_Category(response?.data.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    fetchAstro_Categories()
    fetchLangugaes()
  }, []); // Fetch users on component mount

  // Custom debounce function for search
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear the previous timeout
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        const filtered = allUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Search in 'name' field
        );
        setFilteredUsers(filtered); // Update filtered users
        setCurrentPage(0); // Reset to the first page after search
      }, 300); // 300ms delay
    },
    [allUsers] // Dependency on `allUsers`
  );

  // Trigger debounced search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Pagination logic
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers?.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleAddAstrologer = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (user: any) => {
    setSelectedUser(user); // Set the selected user for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Handle delete button click
  const handleDelete = (user: any) => {
    setSelectedUser(user); // Set the selected user for deletion
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };
  // Handle delete button click


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      console.log({ inputValue })
      if (isEditModalOpen) {
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
      setInputValue(""); // Clear the input after adding
    }
  };


  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      // console.log({ selectedUser });
      // console.log(selectedUser._id);

      // Make a POST request to delete the astrologer, sending the ID in the payload
      const response = await axiosInstance.post(`/admin/delete/astrologer/original`, {
        astrologer_id: selectedUser,
      });

      // Handle success response
      if (response.data.success) {
        toast.success(response.data.message || "Astrologer deleted successfully!"); // Show success toast
        setIsDeleteModalOpen(false); // Close the delete modal

        // Update the local state by removing the deleted user
        const updatedUsers = allUsers.filter((user) => user._id !== selectedUser);
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        toast.error("Something went wrong. Please try again."); // Show error toast if success is false
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting astrologer:", error);
      toast.error("Something went wrong. Please try again."); // Show error toast
    }
  };


  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a POST request to update the astrologer
      const response = await axiosInstance.post(
        `/admin/upadteastrologers`, // Use selectedUser._id as the astrologerId
        selectedUser // Send the selectedUser object as the payload
      );

      if (response.data.success) {
        toast.success(response.data.message || "Astrologer updated successfully!"); // Show success toast
        setIsEditModalOpen(false); // Close the modal after successful update

        // Optionally, update the local state or refetch the data
        const updatedUsers = allUsers.map((user) =>
          user._id === selectedUser._id ? response.data.data : user
        );
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        toast.error("Something went wrong. Please try again."); // Show error toast if success is false
      }

      // Handle success response
    } catch (error) {
      // Handle error
      console.error("Error updating astrologer:", error);
    }
  };

  const CLOUDINARY_CLOUD_NAME = "dlol2hjj8";

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "admin_photos_user");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setSelectedUser(prevData => ({ ...prevData, avatar: response.data.secure_url }));
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "admin_photos_user");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setNewUser(prevData => ({ ...prevData, avatar: response.data.secure_url }));
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploading(false);
    }
  };


  const handleAddAstrologerSubmit = async (e) => {
    // console.log({ newUser })
    e.preventDefault(); // Prevent default form submission behavior

    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Password is incorrect")
      return
    }
    if (newUser.gender === "" || !newUser.gender) {
      toast.error("Please choose Gender")
      return
    }
    if (newUser.isAvailable !== true && newUser.isAvailable !== false) {
      toast.error("Please choose availability")
      return
    }

    if (newUser.isFeatured !== true && newUser.isFeatured !== false) {
      toast.error("Please choose trending option")
      return
    }
    if (!newUser.password) {
      toast.error("Password is missing")
      return
    }
    if (newUser.isVerified !== true && newUser.isVerified !== false) {
      toast.error("Please choose verified options ")
      return
    }
    if (!newUser.languages) {
      toast.error("Please choose language  ")
      return
    }
    // Clean up the specialities array by removing empty strings
    const cleanedSpecialities = newUser.specialities.filter(speciality => speciality.trim() !== "");

    // Update the newUser object with the cleaned specialities array
    const updatedNewUser = { ...newUser, specialities: cleanedSpecialities };
    // console.log({ updatedNewUser })

    try {
      // Send the cleaned new astrologer data to the API
      const response = await axiosInstance.post('/admin/signup/astrologer', updatedNewUser);
      console.log({ response })
      if (response.data.statusCode === 201) {
        toast.success(response.data.message || "Astrologer added successfully!"); // Show success toast
        setIsAddModalOpen(false); // Close the modal

        // Optionally, add the new astrologer to the state
        const updatedUsers = [...allUsers, response.data.data];
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setCurrentStep(1)

      } else {

        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      console.error("Error adding astrologer:", error);
      toast.error("Something went wrong. Please try again."); // Show error toast
    }
  };

  console.log({ selectedUser })
  const validateCurrentStep = (step: any) => {
    if (!isEditModalOpen) {
      let errorMessages = [];
      switch (step) {
        case 1:
          // Check for each required field and return if invalid
          if (!newUser.avatar) {
            errorMessages.push("Avatar is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (!newUser.name) {
            errorMessages.push("Name is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (newUser.isFeatured !== true && newUser.isFeatured !== false) {
            errorMessages.push("The 'is Trending' field must be true or false.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (newUser.specialities.length === 0) {
            errorMessages.push("Specialities are required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (newUser.rating === null || isNaN(newUser.rating) || newUser.rating < 0) {
            errorMessages.push("A valid rating is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (newUser.experience === null || isNaN(newUser.experience) || newUser.experience < 0) {
            errorMessages.push("A valid experience is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (newUser.phone === null || !newUser.phone || newUser.phone.length < 10) {
            errorMessages.push("A valid phone number is required (at least 10 digits).");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }

          // Check if specialities is an array of strings
          if (!Array.isArray(newUser.specialities) || !newUser.specialities.every((s) => typeof s === "string")) {
            errorMessages.push("Specialities should be an array of strings.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }

          break;



        case 2:
          // Validate Step 2 fields
          if (
            newUser.pricePerCallMinute === null ||
            newUser.pricePerVideoCallMinute === null ||
            newUser.pricePerChatMinute === null ||
            newUser.chatCommission === null ||
            newUser.callCommission === null ||
            newUser.videoCallCommission === null ||
            isNaN(newUser.pricePerCallMinute) || newUser.pricePerCallMinute < 0 ||
            isNaN(newUser.pricePerVideoCallMinute) || newUser.pricePerVideoCallMinute < 0 ||
            isNaN(newUser.pricePerChatMinute) || newUser.pricePerChatMinute < 0 ||
            isNaN(newUser.chatCommission) || newUser.chatCommission < 0 ||
            isNaN(newUser.callCommission) || newUser.callCommission < 0 ||
            isNaN(newUser.videoCallCommission) || newUser.videoCallCommission < 0
          ) {
            toast.error("Please fill all required fields in Step 2.");
            return false;
          }
          break;

        case 3:
          // Validate Step 3 fields
          if (newUser.isVerified === null || !newUser.gender) {
            toast.error("Please fill all required fields in Step 3.");
            return false;
          }
          break;

        default:
          return true;
      }
      return true;
    } else {
      let errorMessages = [];
      switch (step) {
        case 1:
          // Check for each required field and return if invalid
          if (!selectedUser.avatar) {
            errorMessages.push("Avatar is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (!selectedUser.name) {
            errorMessages.push("Name is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (selectedUser.isFeatured !== true && selectedUser.isFeatured !== false) {
            errorMessages.push("The 'is Trending' field must be true or false.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (selectedUser.specialities.length === 0) {
            errorMessages.push("Specialities are required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (selectedUser.rating === null || isNaN(selectedUser.rating) || selectedUser.rating < 0) {
            errorMessages.push("A valid rating is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (selectedUser.experience === null || isNaN(selectedUser.experience) || selectedUser.experience < 0) {
            errorMessages.push("A valid experience is required.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }
          if (selectedUser.phone === null || !selectedUser.phone || selectedUser.phone.length < 10) {
            errorMessages.push("A valid phone number is required (at least 10 digits).");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }

          // Check if specialities is an array of strings
          if (!Array.isArray(newUser.specialities) || !newUser.specialities.every((s) => typeof s === "string")) {
            errorMessages.push("Specialities should be an array of strings.");
            toast.error(`Please fill all required fields: ${errorMessages.join(" ")}`);
            return false;
          }

          break;



        case 2:
          // Validate Step 2 fields
          if (
            newUser.pricePerCallMinute === null ||
            newUser.pricePerVideoCallMinute === null ||
            newUser.pricePerChatMinute === null ||
            newUser.chatCommission === null ||
            newUser.callCommission === null ||
            newUser.videoCallCommission === null ||
            isNaN(newUser.pricePerCallMinute) || newUser.pricePerCallMinute < 0 ||
            isNaN(newUser.pricePerVideoCallMinute) || newUser.pricePerVideoCallMinute < 0 ||
            isNaN(newUser.pricePerChatMinute) || newUser.pricePerChatMinute < 0 ||
            isNaN(newUser.chatCommission) || newUser.chatCommission < 0 ||
            isNaN(newUser.callCommission) || newUser.callCommission < 0 ||
            isNaN(newUser.videoCallCommission) || newUser.videoCallCommission < 0
          ) {
            toast.error("Please fill all required fields in Step 2.");
            return false;
          }
          break;

        case 3:
          // Validate Step 3 fields
          if (newUser.isVerified === null || !newUser.gender) {
            toast.error("Please fill all required fields in Step 3.");
            return false;
          }
          break;

        default:
          return true;
      }
      return true;
    }
  };


  return (
    <>
      <Breadcrumb pageName="Manage Astrologers" />
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
              Add  Astrologer
            </button>
            <div>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls" // Allow only Excel files
                onChange={(e) => handleFileUpload(e)}
              />

              {/* Bulk Upload Button */}
              <button
                className="rounded-md bg-blue-300 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
                onClick={() => handleBulkUploadClick()}
              >
                Bulk Upload
              </button>
            </div>
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
        {currentUsers.map((user, key) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            key={key}
          >
            {/* Profile */}
            <div className="flex items-center col-span-2 sm:col-span-2">
              <div className="flex gap-4 items-center">
                <img
                  src={user.avatar}
                  alt="User Profile"
                  className="h-12 w-12 rounded-full"
                />
                <p className="text-sm text-black dark:text-white">{user.name}</p>
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
                {user.specialities.join(", ")}
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">
                ${user.walletBalance}
              </p>
            </div>

            {/* Verified */}
            <div className="flex items-center justify-center col-span-1">
              <p className="text-sm text-black dark:text-white">
                {user.isVerified ? "Yes" : "No"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center col-span-2 space-x-3.5">
              <button
                className="hover:text-primary"
                onClick={() => {
                  setCurrentStep(1)
                  handleEdit(user)
                }} // Pass the user to the edit function
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
        ))}


        {/* Pagination */}
        <div className="flex justify-center py-6">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex space-x-2"}
            pageClassName={"px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400"}
            activeClassName={"bg-blue-300 dark:bg-blue-400 text-white"}
            previousClassName={"px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400"}
            nextClassName={"px-3 py-1 border border-stroke rounded-md hover:bg-blue-300 dark:hover:bg-blue-400"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>




      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-4xl mx-4 landscape-modal">
            <div className="w-full flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Edit Astrologer</h2>
              <p className="font-bold">Step {currentStep}</p>
            </div>
            <form onSubmit={handleEditSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Avatar Image and Upload */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Avatar <span className="text-red-500">*</span>
                    </label>
                    {uploading && (
                      <p className="text-sm text-gray-500">Uploading...</p>
                    )}
                    <div className="flex items-center space-x-4">
                      {/* Display Current Avatar */}
                      <img
                        src={selectedUser.avatar || ""}
                        alt="Avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      {/* File Input for Upload */}
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
                    <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={selectedUser.name || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, name: e.target.value })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedUser.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          setSelectedUser({ ...selectedUser, phone: value });
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                    <p className="text-[12px] text-grey">Phone number must be 10 digits</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Experience (years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.experience || 0}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          experience: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      placeholder="Please enter rating from 0 to 5"
                      value={selectedUser.rating}
                      onChange={(e) => {
                        if (Number(e.target.value) > 5 || Number(e.target.value) < 0) {
                          toast.error("Rating must be between 0 to 5");
                          setSelectedUser({
                            ...selectedUser,
                            rating: 0,
                          });
                          return;
                        }
                        setSelectedUser({
                          ...selectedUser,
                          rating: Number(e.target.value),
                        });
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

                  {/* Is Trending */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Is Trending? <span className="text-red-500">*</span></label>
                    <select
                      value={selectedUser.isFeatured ? "true" : "false"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          isFeatured: e.target.value === "true",
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    >
                      <option value="">Select Options</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing and Commissions */}
              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Price Per Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.pricePerCallMinute}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          pricePerCallMinute: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Price Per Video Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Video Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.pricePerVideoCallMinute}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          pricePerVideoCallMinute: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Price Per Chat Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Chat Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.pricePerChatMinute}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          pricePerChatMinute: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Chat Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Chat Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.chatCommission}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          chatCommission: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.callCommission}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          callCommission: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Video Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Video Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedUser.videoCallCommission}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          videoCallCommission: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Verification and Gender */}
              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Verified */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Is Verified? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedUser.isVerified ? "Yes" : "No"}
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

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender <span className="text-red-500">*</span>
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
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Password */}

                  {/* Available */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Available <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedUser.isAvailable ? "True" : "False"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          isAvailable: e.target.value === "True",
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    >
                      <option value="">Select Options</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  </div>

                  {/* Languages (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Languages <span className="text-red-500">*</span>
                    </label>
                    <Select
                      isMulti
                      options={languageOptions}
                      value={
                        selectedUser?.languages?.length > 0
                          ? languageOptions.filter((option) =>
                            selectedUser.languages.includes(option.value)
                          )
                          : null
                      }
                      onChange={(selectedOptions) =>
                        setSelectedUser({
                          ...selectedUser,
                          languages: selectedOptions.map((option) => option.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Category (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Astrologer Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={
                        selectedUser?.category?.length > 0
                          ? categoryOptions.filter((option) =>
                            selectedUser.category.includes(option.value)
                          )
                          : null
                      }
                      onChange={(selectedOptions) =>
                        setSelectedUser({
                          ...selectedUser,
                          category: selectedOptions.map((option) => option.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 space-x-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentStep(1); // Reset step to 1
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>

                {/* Previous Button */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400"
                  >
                    Previous
                  </button>
                )}

                {/* Next Button */}
                {currentStep < 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateCurrentStep(currentStep)) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Next
                  </button>
                )}

                {/* Submit Button */}
                {currentStep === 3 && (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
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
                onClick={() => setIsDeleteModalOpen(false)} // Close the modal
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm} // Confirm deletion
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-4xl mx-4 landscape-modal">
            <div className="w-full flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Add Astrologer</h2>
              <p className="font-bold">Step {currentStep}</p>
            </div>
            <form onSubmit={handleAddAstrologerSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Avatar Image and Upload */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Avatar <span className="text-red-500">*</span>
                    </label>

                    {uploading && (
                      <p className="text-sm text-gray-500">Uploading...</p>
                    )}
                    <div className="flex items-center space-x-4">
                      {/* Display Current Avatar */}
                      <img
                        src={newUser.avatar || ""}
                        alt="Avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      {/* File Input for Upload */}
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
                    <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newUser.name || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) { // Only allow digits
                          setNewUser({ ...newUser, phone: value });
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                    <p className="text-[12px] text-grey">Phone number must be 10 digit</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Experience (years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newUser.experience || 0}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          experience: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>


                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      placeholder="Please enter rating from 0 to 5"
                      value={newUser.rating}
                      onChange={(e) => {
                        if (Number(e.target.value) > 5 || Number(e.target.value) < 0) {
                          toast.error("Rating must be between 0 to 5");
                          setNewUser({
                            ...newUser,
                            rating: 0,
                          })
                          return
                        }
                        setNewUser({
                          ...newUser,
                          rating: Number(e.target.value),
                        })
                      }
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


                    <div className="relative">

                      <div
                        className="flex flex-wrap gap-2 my-2"
                        style={{
                          maxHeight: "80px", // Adjust the height as needed
                          maxWidth: "100%", // Set the width, or use a fixed value like '300px'
                          overflowY: "auto", // Enables vertical scrolling
                          overflowX: "hidden", // Optional: Hides horizontal scrolling
                        }}
                      >
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

                  </div>


                  {/* Is Trending */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Is Trending? <span className="text-red-500">*</span></label>
                    <select
                      value={newUser.isFeatured ? "true" : "false"}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          isFeatured: e.target.value === "true",
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    >

                      <option value="">Selct Options</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing and Commissions */}
              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Price Per Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newUser.pricePerCallMinute}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            pricePerCallMinute: value,
                          });
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Price Per Video Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Video Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newUser.pricePerVideoCallMinute}
                      min={0}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            pricePerVideoCallMinute: e.target.value,
                          })
                        }
                      }

                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Price Per Chat Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price Per Chat Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newUser.pricePerChatMinute}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            pricePerChatMinute: e.target.value,
                          })
                        }
                      }}


                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Chat Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Chat Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newUser.chatCommission}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            chatCommission: e.target.value,
                          })
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newUser.callCommission}
                      min={0}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            callCommission: e.target.value,
                          })
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>

                  {/* Commission Per Video Call Minute */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Per Video Call Minute <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newUser.videoCallCommission}

                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value !== "") {
                          setNewUser({
                            ...newUser,
                            videoCallCommission: e.target.value,
                          })
                        }
                      }}
                      className="w-full p-2 border border-stroke rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Verification and Gender */}
              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Verified */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Is Verified? <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.gender || ""}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          gender: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          value={newUser.password || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              password: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-stroke rounded-md"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-2 text-gray-500"
                        >
                          {passwordVisible ? (
                            <AiOutlineEyeInvisible className="w-6 h-6" />
                          ) : (
                            <AiOutlineEye className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          value={newUser.confirmPassword || ""}
                          disabled={!newUser.password}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-stroke rounded-md"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-2 text-gray-500"
                        >
                          {confirmPasswordVisible ? (
                            <AiOutlineEyeInvisible className="w-6 h-6" />
                          ) : (
                            <AiOutlineEye className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Available */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Available <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.isAvailable}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          isAvailable: e.target.value === "True",
                        })
                      }
                      className="w-full p-2 border border-stroke rounded-md"
                    >
                      <option value="">Select Options</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  </div>

                  {/* Languages (Multi-select) */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Languages <span className="text-red-500">*</span>
                      </label>
                      <Select
                        isMulti
                        options={languageOptions}
                        value={
                          newUser?.languages?.length > 0
                            ? languageOptions.filter((option) => newUser.languages.includes(option.value))
                            : null // Show placeholder when no selection
                        }
                        onChange={(selectedOptions) =>
                          setNewUser({
                            ...newUser,
                            languages: selectedOptions.map((option) => option.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>



                  </div>
                  {/* Category (Multi-select) */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Astrologer Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        isMulti
                        options={categoryOptions}
                        value={
                          newUser?.category?.length > 0
                            ? categoryOptions.filter((option) => newUser.category.includes(option.value))
                            : null // Show placeholder when no selection
                        }
                        onChange={(selectedOptions) =>
                          setNewUser({
                            ...newUser,
                            category: selectedOptions.map((option) => option.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>



                  </div>
                </div>

              )}


              {/* Modal Footer */}
              <div className="flex justify-end mt-6 space-x-4">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setCurrentStep(1); // Reset step to 1
                    setNewUser({
                      name: "",
                      avatar: "",
                      specialities: [],
                      experience: 0,
                      isVerified: false,
                      pricePerChatMinute: 0,
                      pricePerCallMinute: 0,
                      pricePerVideoCallMinute: 0,
                      isFeatured: false,
                      chatCommission: 0,
                      callCommission: 0,
                      videoCallCommission: 0,
                      rating: 0,
                    })
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>

                {/* Previous Button */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400"
                  >
                    Previous
                  </button>
                )}

                {/* Next Button */}
                {currentStep < 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateCurrentStep(currentStep)) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Next
                  </button>
                )}

                {/* Submit Button */}
                {currentStep === 3 && (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </div >
        </div >
      )}
      <Toaster />
    </>
  );
};

export default ManageAIAstrologer;