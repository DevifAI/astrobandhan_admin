import React, { useState, ChangeEvent, useEffect } from 'react';
import { Product } from '../../types/Products';
import axiosInstance from '../../utils/axiosInstance';
import { Category } from '../../types/categoryTypes';

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
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>('');
  const [newContainsItem, setNewContainsItem] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.image) setImage(product.image); // show image preview if already uploaded
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

    const formDataToSubmit = new FormData();

    try {
      if (formData.productName)
        formDataToSubmit.append('productName', formData.productName);
      if (formData.productDescription)
        formDataToSubmit.append(
          'productDescription',
          formData.productDescription,
        );
      if (formData.category && typeof formData.category === 'object') {
        formDataToSubmit.append('category', formData.category._id);
      }
      if (formData.originalPrice !== undefined) {
        formDataToSubmit.append(
          'originalPrice',
          String(formData.originalPrice),
        );
      }
      if (formData.displayPrice !== undefined) {
        formDataToSubmit.append('displayPrice', String(formData.displayPrice));
      }
      if (formData.brand) formDataToSubmit.append('brand', formData.brand);
      if (formData.weight) formDataToSubmit.append('weight', formData.weight);
      if (formData.material)
        formDataToSubmit.append('material', formData.material);
      formDataToSubmit.append('in_stock', formData.in_stock ? 'true' : 'false');
      formDataToSubmit.append(
        'contains',
        JSON.stringify(formData.contains || []),
      );

      if (imageFile) formDataToSubmit.append('image', imageFile);

      const url = product
        ? `/product/update/${product._id}`
        : '/product/createProduct';

      const method = product ? axiosInstance.put : axiosInstance.post;

      const res = await method(url, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // update parent with fresh data
      onProductCreated(res.data?.data || res.data);
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unknown error';
      alert(`Error: ${message}`);
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
                  />
                  <label
                    htmlFor="imgUpload"
                    className="cursor-pointer text-blue-600 dark:text-blue-300"
                  >
                    Upload Product Image
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
            </div>

            <div className="space-y-4">
              <input
                type="number"
                name="originalPrice"
                placeholder="Original Price"
                value={formData.originalPrice || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                name="displayPrice"
                placeholder="Display Price"
                value={formData.displayPrice || ''}
                onChange={handleChange}
                required
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
                className="flex-grow px-3 py-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={handleAddContainsItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
              >
                Add
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto border p-2 rounded-md dark:bg-gray-800">
              {formData.contains?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-1 bg-gray-100 dark:bg-gray-700 mb-1 rounded"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveContainsItem(idx)}
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
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
            {/* <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button> */}

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading
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
