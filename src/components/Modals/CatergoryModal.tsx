import React, { useEffect, useState } from 'react';
import { CategoryModalProps } from '../../types/categoryTypes';
import { createCategoryAPI, updateCategoryAPI } from '../../apis/categoryApis';


const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  fetchCategories
  // onHandleSubmit, // optional external handler
}) => {
  const [formData, setFormData] = useState<{
    category_name: string;
    no_of_items: number;
    imageUrl: File | string | null;
  }>({
    category_name: '',
    no_of_items: 0,
    imageUrl: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageUrl: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: null });
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('category_name', formData.category_name);
      payload.append('no_of_items', formData.no_of_items.toString());

      if (formData.imageUrl instanceof File) {
        payload.append('image', formData.imageUrl);
      }

      if (category?._id) {
        payload.append('_id', category._id); // for update
        await updateCategoryAPI(payload, category._id);
      } else {
        await createCategoryAPI(payload);
      }

      // if (onHandleSubmit) {
      //   await onHandleSubmit(payload);
      // }

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      fetchCategories()
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || '',
        no_of_items: category.totalItems || 0,
        imageUrl: category.imageUrl || null,
      });
      setPreview(typeof category.imageUrl === 'string' ? category.imageUrl : null);
    } else {
      setFormData({
        category_name: '',
        no_of_items: 0,
        imageUrl: null,
      });
      setPreview(null);
    }
  }, [category]);

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mt-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          {category ? 'Edit Category' : 'Add Category'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Image
              </label>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-40 h-40">
                  {preview ? (
                    <>
                      <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full"
                      >
                        <CloseIcon />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <CameraIcon />
                    </div>
                  )}
                </div>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-1 text-lg font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                  {preview ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                required
                className="mt-1 block w-full py-2 px-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Items
              </label>
              <input
                type="number"
                value={formData.no_of_items}
                disabled
                className="mt-1 block w-full py-2 px-4 border border-gray-300 bg-gray-100 text-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-6 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-lg bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-1 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 ${
                loading ? 'cursor-wait' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default CategoryModal;
