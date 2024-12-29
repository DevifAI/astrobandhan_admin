import React, { useState } from "react";

type Category = {
  name: string;
  category_id: string;
  no_of_items: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;  // Optional, as it can be used for both edit and add
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

const CategoryModal: React.FC<ModalProps> = ({ isOpen, onClose, category, setCategories }) => {

  const [formData, setFormData] = useState<Category>(category || {
    name: '',
    category_id: '',
    no_of_items: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      const updatedCategories = setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.category_id === category.category_id ? formData : cat
        )
      );
    } else {
      setCategories(prevCategories => [...prevCategories, formData]);
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 `}>
      {/* Modal background */}
      <div className="absolute inset-0 backdrop-blur-lg border-4"></div>

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 p-8 shadow-lg w-full max-w-2xl h-[75vh] overflow-y-auto z-10 mt-20">
        <h2 className="text-2xl font-bold text-center mb-4">{category ? 'Edit Category' : 'Add Category'}</h2>
        
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
            />
          </label>

          <label className="block mb-4">
            Category ID:
            <input
              type="text"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className=" text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
            />
          </label>

          <label className="block mb-4">
            No of Items:
            <input
              type="number"
              value={formData.no_of_items}
              onChange={(e) => setFormData({ ...formData, no_of_items: parseInt(e.target.value) })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 "
            />
          </label>

          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Save</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;



