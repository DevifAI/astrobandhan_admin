import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Product } from '../../types/Products.ts';
import ProductModal from '../../components/Modals/ProductModal.tsx';
import axiosInstance from '../../utils/axiosInstance.ts';
import axios from 'axios';

const Products: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/productCategory');
      const fetched = res.data.data;
      if (Array.isArray(fetched)) {
        const formatted = [{ value: '', label: 'All Categories' }, ...fetched.map((cat: any) => ({
          value: cat._id,
          label: cat.category_name,
        }))];
        setCategories(formatted);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/product');
      const { data } = response.data;
      if (Array.isArray(data)) {
        setAllProducts(data);
        setFilteredProducts(data);
        setError(null);
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products on search/category change
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => p.productName.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?._id === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // reset to first page when filter changes
  }, [searchQuery, selectedCategory, allProducts]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleProductCreatedOrUpdated = () => {
    fetchProducts();
    setShowModal(false);
    setEditProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosInstance.delete(`/product/delete/${id}`);
      fetchProducts();
    } catch {
      alert('Failed to delete the product.');
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-[60%] flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Product Name"
              className="w-full bg-transparent px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-dark dark:border-gray-600"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[50%] bg-transparent pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-dark dark:border-gray-600"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value} className="dark:text-black">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 mt-4 md:mt-0"
            onClick={() => {
              setEditProduct(null);
              setShowModal(true);
            }}
          >
            Add Product
          </button>
        </div>

        {error && <p className="text-red-500 px-4">{error}</p>}
        {loading ? (
          <p className="px-4">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 font-medium text-center">
              <p>Product</p>
              <p className="col-span-2">Category</p>
              <p>Display Price</p>
              <p>Price</p>
              <p>Stock</p>
              <p>Actions</p>
            </div>

            {paginatedProducts.map((product) => (
              <div
                className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 text-center"
                key={product._id}
              >
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-10 w-10 rounded-full"
                  />
                  <p>{product.productName}</p>
                </div>
                <p className="col-span-2">{product.category?.category_name}</p>
                <p>{product.displayPrice}</p>
                <p>{product.originalPrice}</p>
                <p className={`text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? 'Available' : 'Not Available'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setEditProduct(product);
                      setShowModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center py-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {showModal && (
          <ProductModal
            product={editProduct}
            onClose={() => {
              setShowModal(false);
              setEditProduct(null);
            }}
            onProductCreated={handleProductCreatedOrUpdated}
          />
        )}
      </div>
    </>
  );
};

export default Products;
