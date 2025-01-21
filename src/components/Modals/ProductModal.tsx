import React, { useState, ChangeEvent } from 'react';
import { Product } from '../../types/Products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: { _id: string; category_name: string }[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSave,
  categories,
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      _id: '',
      productName: '',
      image: '',
      productDescription: '',
      category: {
        _id: '',
        category_name: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
      rating: 0,
      brand: '',
      weight: '',
      material: '',
      originalPrice: 0,
      displayPrice: 0,
      in_stock: false,
      isTrending: false,
      createdAt: '',
      updatedAt: '',
      __v: 0,
      total_stock: 0,
      contains: [],
    },
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(value);
    if (name === 'originalPrice') {
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          name === 'originalPrice' ? Number((value.toString()) + (prevData.originalPrice).toString()) : 0,
      }));
    }
    else if (name === 'displayPrice') {
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          name === 'displayPrice' ? Number(value) + prevData.displayPrice : 0,
      }));
    }
    else if (name === 'total_stock') {
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          name === 'total_stock' ? Number(value) + prevData.total_stock : 0,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(
    product?.image || '',
  );

  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleInStockChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      in_stock: !prevData.in_stock,
    }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-2 mt-16">
    <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      {/* Modal Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-8 py-6 border-b rounded-t-lg">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
      </div>

      {/* Modal Body */}
      <div className="px-8 py-6 space-y-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300'
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
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  onClick={() => {
                    setPreviewImage('');
                    setFormData((prev) => ({ ...prev, image: '' }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto text-gray-400 flex items-center justify-center">
                  <span className="text-3xl">↑</span>
                </div>
                <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-400 justify-center gap-2">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
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
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <textarea
              name="productDescription"
              placeholder="Description"
              rows={4}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <select
              name="category"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-white"
            >
              <option value="" disabled selected>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            <input
              type="number"
              name="displayPrice"
              placeholder="Price"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <input
              type="number"
              name="total_stock"
              placeholder="Stock Quantity"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <div className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
  <div className="flex items-center">
    <span className="text-base font-medium text-gray-900 dark:text-white mr-3">In Stock</span>
    <span className={`text-sm ${formData.in_stock ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {formData.in_stock ? 'Available' : 'Not Available'}
    </span>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={formData.in_stock}
      onChange={handleInStockChange}
    />
    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
    </div>
  </label>
</div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-8 py-2 border-t">
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductModal;
