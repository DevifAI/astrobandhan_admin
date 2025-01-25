import React, { useState, ChangeEvent, useEffect } from 'react';
import { Product } from '../../types/Products';
import axiosInstance from '../../utils/axiosInstance';
import { Category } from '../../types/categoryTypes';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  // onSave: (product: Product) => void;
  onProductCreated: (product: Product)=> void;
};


const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onProductCreated
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    productName: '',
    productDescription: '',
    category: {
      _id: '',
      category_name: '',
      createdAt: '',
      updatedAt: '',
      __v: 0
    },
    originalPrice: 0,
    displayPrice: 0,
    brand: '',
    weight: '',
    material: '',
    in_stock: true,
    contains: [],
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>('');
  const [newContainsItem, setNewContainsItem] = useState<string>('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/productCategory');
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'originalPrice' || name === 'displayPrice' 
        ? Number(value || 0)
        : name === 'category'
        ? { 
            _id: value,
            category_name: categories.find(c => c._id === value)?.category_name || '',
            createdAt: '',
            updatedAt: '',
            __v: 0
          }
        : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'contains' && Array.isArray(value)) {
          value.forEach((item, index) => {
            formDataToSubmit.append(`contains[${index}]`, item);
          });
        } else if (key === 'category') {
          formDataToSubmit.append('category', (value as Category)._id);
        } else {
          formDataToSubmit.append(key, String(value));
        }
      }
    });

    // Append image file
    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    }

    try {
      const response = await axiosInstance.post('/product/createProduct', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onProductCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Add contains item
  const handleAddContainsItem = () => {
    if (newContainsItem.trim()) {
      setFormData(prev => ({
        ...prev,
        contains: [...(prev.contains || []), newContainsItem.trim()]
      }));
      setNewContainsItem('');
    }
  };

  // Remove contains item
  const handleRemoveContainsItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contains: prev.contains?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ">
    <div className="w-full max-w-4xl mt-8 h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-600">
      <h2 className="text-lg font-semibold dark:text-white">
        {product ? `Edit Product - ${product.productName}` : 'Add Product'}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        ✕
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-4 w-full h-[90%]">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Image Upload Section - Always at Top */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="border-2 border-dashed rounded-lg p-4 text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Product Preview" 
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setImage('');
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                  id="imageUpload"
                />
                <label 
                  htmlFor="imageUpload" 
                  className="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Upload Product Image
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-4">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={formData.productName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />

            <textarea
              name="productDescription"
              placeholder="Product Description"
              value={formData.productDescription || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              rows={4}
              required
            />

            <select
              name="category"
              value={(formData.category as Category)?._id || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
          <div>
    <label
      htmlFor="originalPrice"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Original Price
    </label>
    <input
      type="number"
      id="originalPrice"
      name="originalPrice"
      placeholder="Original Price"
      value={formData.originalPrice || ''}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
      required
      min="0"
    />
  </div>

  <div>
    <label
      htmlFor="displayPrice"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Display Price
    </label>
    <input
      type="number"
      id="displayPrice"
      name="displayPrice"
      placeholder="Display Price"
      value={formData.displayPrice || ''}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
      required
      min="0"
    />
  </div>

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Contains Items Section */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Contains Items</h3>
            <div className="flex mb-2">
              <input
                type="text"
                value={newContainsItem}
                onChange={(e) => setNewContainsItem(e.target.value)}
                placeholder="Add item"
                className="flex-grow px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={handleAddContainsItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600">
              {formData.contains?.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 mb-1 p-2 rounded"
                >
                  <span className="truncate dark:text-white">{item}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveContainsItem(index)}
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

       {/* Modal Footer */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Product
          </button>
        </div>

      </form>
      </div>

      

    </div>
  </div>
  );
};

export default ProductModal;