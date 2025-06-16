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
    image: '',
    rating: 0,
    isTrending: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>('');
  const [newContainsItem, setNewContainsItem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.image) setImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/productCategory');
        if (Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to fetch categories');
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
        name === 'originalPrice' || name === 'displayPrice'
          ? Number(value || 0)
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
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setUploading(true);

    try {
      // Display preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', 'admin_photos_user');

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        cloudinaryFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            // Optional: Add progress tracking
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        },
      );

      if (!cloudinaryResponse.data.secure_url) {
        throw new Error('No image URL returned from Cloudinary');
      }

      setFormData((prev) => ({
        ...prev,
        image: cloudinaryResponse.data.secure_url, // Fixed: was using imageUrl but formData uses image
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      // Reset image state on error
      setImage('');
      setImageFile(null);
    } finally {
      setUploading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        category: formData.category?._id,
        originalPrice: formData.originalPrice,
        displayPrice: formData.displayPrice,
        brand: formData.brand,
        weight: formData.weight,
        material: formData.material,
        in_stock: formData.in_stock,
        contains: formData.contains,
        image: formData.image,
      };

      console.log('Submitting product data:', payload);

      const url = product
        ? `/product/update/${product._id}`
        : '/product/createProduct';

      const method = product ? axiosInstance.put : axiosInstance.post;

      const res = await method(url, payload);

      onProductCreated(res.data?.data || res.data);
      onClose();
      toast.success(
        product
          ? 'Product updated successfully'
          : 'Product created successfully',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unknown error';
      toast.error(`Error: ${message}`);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 w-full h-[90%] flex flex-col"
        >
          {/* Image Upload */}
          <div className="p-6">
            <div className="border-2 border-dashed p-4 rounded-lg text-center">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage('');
                      setImageFile(null);
                      setFormData((prev) => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imgUpload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="imgUpload"
                    className={`cursor-pointer ${
                      uploading
                        ? 'text-gray-400'
                        : 'text-blue-600 dark:text-blue-300'
                    }`}
                  >
                    {uploading ? 'Uploading...' : 'Upload Product Image'}
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6 px-6">
            <div className="space-y-4">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <textarea
                name="productDescription"
                placeholder="Description"
                value={formData.productDescription || ''}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <select
                name="category"
                value={(formData.category as Category)?._id || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="in_stock"
                  id="in_stock"
                  checked={formData.in_stock || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      in_stock: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="in_stock" className="dark:text-white">
                  In Stock
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="number"
                name="originalPrice"
                placeholder="Original Price"
                value={formData.originalPrice || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                name="displayPrice"
                placeholder="Display Price"
                value={formData.displayPrice || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="weight"
                placeholder="Weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                name="material"
                placeholder="Material"
                value={formData.material || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Contains Items */}
          <div className="px-6 mt-4">
            <label className="block mb-2 font-medium dark:text-white">
              Contains
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newContainsItem}
                onChange={(e) => setNewContainsItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddContainsItem()}
                className="flex-grow px-3 py-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Add an item"
              />
              <button
                type="button"
                onClick={handleAddContainsItem}
                disabled={!newContainsItem.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:bg-blue-300"
              >
                Add
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto border p-2 rounded-md dark:bg-gray-800">
              {formData.contains?.length ? (
                formData.contains.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-1 bg-gray-100 dark:bg-gray-700 mb-1 rounded"
                  >
                    <span className="dark:text-white">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveContainsItem(idx)}
                      className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                  No items added
                </p>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading
                ? product
                  ? 'Updating...'
                  : 'Creating...'
                : product
                ? 'Update Product'
                : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
