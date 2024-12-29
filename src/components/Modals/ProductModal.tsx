import React, { useState, ChangeEvent } from "react";
import { Product } from '../../types/Products';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  onSave,
  categories
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: 0,
      name: "",
      description: "",
      category: categories[0] || "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      image: "",
    }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "price" || name === "discountPrice" || name === "stockQuantity"
        ? value === "" ? 0 : Number(value)
        : value,
    }));
  };

  const handleSubmit = () => {
  if (!formData.name || !formData.description || !formData.category) {
      alert('Please fill in all required fields.');
      return;
    }  
    
    const submissionData = {
      ...formData,
      price: formData.price ?? 0,
      discountPrice: formData.discountPrice ?? 0,
      stockQuantity: formData.stockQuantity ?? 0,
    };
    console.log('Form Data on Submit:', submissionData);
    onSave(submissionData);
  };

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(product?.image || '');

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: name === "price" || name === "discountPrice" || name === "stockQuantity" 
  //       ? value === "" ? null : Number(value)
  //       : value,
  //   }));
  // };

  // const handleSubmit = () => {
  //   // Convert null values to 0 before submitting
  //   const submissionData = {
  //     ...formData,
  //     price: formData.price ?? 0,
  //     discountPrice: formData.discountPrice ?? 0,
  //     stockQuantity: formData.stockQuantity ?? 0,
  //   };
  //   console.log('Form Data on Submit:', submissionData);
  //   onSave(submissionData);
  // };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    let file: File | null = null;
    
    if ('dataTransfer' in e) {
      file = e.dataTransfer?.files[0];
    } else if ('target' in e && e.target.files) {
      file = e.target.files[0];
    }
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData((prev: any) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Add styles to remove spinner buttons from number inputs
  const numberInputStyle = `
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex md:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <style>{numberInputStyle}</style>
      <div className="relative min-h-screen md:min-h-fit w-full md:max-w-2xl md:my-8 mx-auto p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          {/* Modal Header - Fixed at top */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-6 py-4 border-b rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {product ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="text-xl font-medium">×</span>
              </button>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="px-6 py-4 space-y-6 max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload Section */}
              <div className="space-y-4 md:col-span-2">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleImageDrop}
                >
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setPreviewImage('');
                          setFormData((prev: any) => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <span className="text-sm">×</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-8 h-8 mx-auto text-gray-400 flex items-center justify-center">
                        <span className="text-2xl">↑</span>
                      </div>
                      <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-400 justify-center gap-1">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageDrop}
                          />
                        </label>
                        <p>or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-white dark:bg-gray-800"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price ?? ''}
                  onChange={handleChange}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice ?? ''}
                  onChange={handleChange}
                  placeholder="Discounted Price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity ?? ''}
                  onChange={handleChange}
                  placeholder="Stock Quantity"
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer - Fixed at bottom */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {product ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;