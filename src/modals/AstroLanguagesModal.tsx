import { useState } from 'react';

const AstroLanguagesModal = ({ isOpen, closeModal, onAddLanguage }) => {
    const [newLanguage, setNewLanguage] = useState("");

    const handleSubmit = () => {
        if (newLanguage) {
            onAddLanguage(newLanguage);
            setNewLanguage(""); // Reset input field
            closeModal();
        } else {

        }
    };

    console.log({ newLanguage })

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Add a New Language</h3>
                <input
                    type="text"
                    placeholder="Enter language name"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </div>
            </div>
        </div>
    );
};

export default AstroLanguagesModal;
