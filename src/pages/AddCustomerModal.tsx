import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AddCustomerModal = ({ isOpen, onClose, setIsAddCustomerAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        timeOfBirth: "00:00 AM",
        placeOfBirth: "",
        gender: "",
        password: "",
        photo: null,
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [uploading, setUploading] = useState(false);

    const CLOUDINARY_CLOUD_NAME = "dlol2hjj8";
    const steps = 3;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "admin_photos_user");

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                data
            );
            setFormData(prev => ({ ...prev, photo: response.data.secure_url }));
        } catch (error) {
            console.error("Error uploading photo:", error);
        } finally {
            setUploading(false);
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            return formData.name && formData.email && formData.phone;
        }
        if (currentStep === 2) {
            return formData.dateOfBirth && formData.placeOfBirth;
        }
        if (currentStep === 3) {
            return formData.gender && formData.password;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) {
            toast.error("Please fill in all required fields before continuing.");
            return;
        }
        if (currentStep < steps) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = Object.values(formData).every(value => value !== "" && value !== null);

        if (!isFormValid) {
            setIsAddCustomerAdded({ status: true, message: "Form Validation Failed" });
            return;
        }

        try {
            const response = await axiosInstance.post("/user/signup", formData);
            if (response.data.status === 200) {
                toast.success("User Registered Successfully")
                // setIsAddCustomerAdded({ status: false, message: response.data.message });
            } else {
                setIsAddCustomerAdded({ status: true, message: response.data.message });
            }

            setFormData({
                name: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                timeOfBirth: "00:00 AM",
                placeOfBirth: "",
                gender: "",
                password: "",
                photo: null,
            });
            setCurrentStep(1);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
            console.error("Submission Error:", error.response?.data?.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-auto">
                <h2 className="text-xl font-bold mb-4">Add Customer</h2>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Phone <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Time of Birth</label>
                                <input
                                    type="time"
                                    name="timeOfBirth"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.timeOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Place of Birth <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="placeOfBirth"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.placeOfBirth}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1">Gender <span className="text-red-500">*</span></label>
                                <select
                                    name="gender"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Photo <span className="text-red-500">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handlePhotoChange}
                                />
                                {uploading && (
                                    <p className="text-sm text-gray-500">Uploading...</p>
                                )}
                            </div>
                            {formData.photo && (
                                <div className="mb-4">
                                    <img
                                        src={formData.photo}
                                        alt="Uploaded"
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block mb-1">Password <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        )}
                        {currentStep < steps && (
                            <>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        setFormData({
                                            name: "",
                                            email: "",
                                            phone: "",
                                            dateOfBirth: "",
                                            timeOfBirth: "00:00 AM",
                                            placeOfBirth: "",
                                            gender: "",
                                            password: "",
                                            photo: null,
                                        });
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </>
                        )}
                        {currentStep === steps && (
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                disabled={uploading}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;
