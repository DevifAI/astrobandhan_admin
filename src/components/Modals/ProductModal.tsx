import React, { useState, ChangeEvent, useEffect } from 'react';
import { Product } from '../../types/Products';
import axiosInstance from '../../utils/axiosInstance';
import { Category } from '../../types/categoryTypes';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CLOUDINARY_CLOUD_NAME = 'dlol2hjj8';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onProductCreated,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    productName: '',
    productDescription: '',
    category: {
      _id: '',
      category_name: '',
      createdAt: '',
      updatedAt: '',
      __v: 0,
    },
    originalPrice: 0,
    displayPrice: 0,
    brand: '',
    weight: '',
    material: '',
    in_stock: true,
    contains: [],
    imageUrl: '',
    rating: 0,
    isTrending: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>('');
  const [newContainsItem, setNewContainsItem] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImage(product.imageUrl || product.image || '');
    }
  }, [product]);

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        ['originalPrice', 'displayPrice', 'rating'].includes(name)
          ? parseFloat(value) || 0
          : name === 'category'
            ? {
              _id: value,
              category_name:
                categories.find((c) => c._id === value)?.category_name || '',
              createdAt: '',
              updatedAt: '',
              __v: 0,
            }
            : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploading(true);

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', 'admin_photos_user');

      try {
        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          cloudinaryFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const image = cloudinaryResponse.data.secure_url;
        setImage(image);
        setFormData((prev) => ({
          ...prev,
          imageUrl: image,
        }));
      } catch (error) {
        console.error('Cloudinary upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jsonDataToSubmit: any = {};

      // Serialize form data into JSON
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'contains' && Array.isArray(value)) {
            jsonDataToSubmit[key] = value.map((item) => String(item));
          } else if (key === 'category') {
            jsonDataToSubmit[key] = (value as Category)._id;
          } else if (['originalPrice', 'displayPrice', 'rating'].includes(key)) {
            jsonDataToSubmit[key] = Number(value);
          } else {
            jsonDataToSubmit[key] = String(value);
          }
        }
      });

      let response;
      if (product && product._id) {
        // Update product
        response = await axiosInstance.patch(
          `/product/update/${product._id}`,
          jsonDataToSubmit,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        toast.success('Product updated successfully!');
      } else {
        // Create product
        response = await axiosInstance.post(
          '/product/createProduct',
          jsonDataToSubmit,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        toast.success('Product created successfully!');
      }

      // onProductCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContainsItem = () => {
    if (newContainsItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        contains: [...(prev.contains || []), newContainsItem.trim()],
      }));
      setNewContainsItem('');
    }
  };

  const handleRemoveContainsItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contains: prev.contains?.filter((_, i) => i !== index),
    }));
  };

  const handleImageRemove = () => {
    setImage('');
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }));
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ">
      <div className="w-full max-w-4xl h-[520px] overflow-y-scroll bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold dark:text-white">
            {product ? `Edit Product - ${product.productName}` : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Product Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 px-2 right-2 border-2 border-blue-500 text-blue-500 p-1 rounded-full "
                >
                  Re Upload
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
                  disabled={uploading}
                />
                <label
                  htmlFor="imageUpload"
                  className={`cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ${uploading ? 'opacity-50' : ''
                    }`}
                >
                  {uploading ? 'Uploading...' : 'Upload Product Image'}
                </label>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  placeholder="Product Name"
                  value={formData.productName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Description
                </label>
                <textarea
                  name="productDescription"
                  placeholder="Product Description"
                  value={formData.productDescription || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={(formData.category as Category)?._id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  placeholder="Material"
                  value={formData.material || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="Original Price"
                  value={formData.originalPrice || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Price
                </label>
                <input
                  type="number"
                  name="displayPrice"
                  placeholder="Display Price"
                  value={formData.displayPrice || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  min={0}
                  max={5}
                  placeholder="Rating"
                  value={formData.rating || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                  min="0"
                  max="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  In Stock
                </label>
                <select
                  name="in_stock"
                  value={formData.in_stock ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      in_stock: e.target.value === 'true',
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trending
                </label>
                <select
                  name="isTrending"
                  value={formData.isTrending ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isTrending: e.target.value === 'true',
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;