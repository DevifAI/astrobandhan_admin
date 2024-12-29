import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Product } from "../../types/Products.ts";
import ProductModal from "../../components/Modals/ProductModal.tsx";

import UserOne from "../../images/user/user-01.png";

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    description: "Short description of Product 1",
    category: "Category 1",
    price: 100,
    discountPrice: 90,
    stockQuantity: 50,
    image: UserOne,
  },
  {
    id: 2,
    name: "Product 2",
    description: "Short description of Product 2",
    category: "Category 2",
    price: 200,
    discountPrice: 180,
    stockQuantity: 30,
    image: UserOne,
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setShowModal(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditProduct(null);
    setShowModal(false);
  };

  return (
    <>
      <Breadcrumb pageName="Products" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header Section */}
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center">
          <div>
            <form action="#" method="POST">
              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                      fill=""
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                />
              </div>
            </form>
          </div>
          <button
            className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300"
            onClick={() => {
              setEditProduct(null);
              setShowModal(true);
            }}
          >
            Add Product
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Product</p>
          </div>
          <div className="flex items-center justify-center col-span-2">
            <p className="font-medium text-center">Description</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Category</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Price</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Discounted Price</p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-1">
            <p className="font-medium text-center">Stock Quantity</p>
          </div>
          <div className="flex items-center justify-center col-span-1 space-x-3.5">
            <p className="font-medium text-center">Actions</p>
          </div>
        </div>

        {/* Table Body */}
        {products .map((product) => (
          <div
            className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={product.id}
          >
            <div className="flex items-center col-span-1 sm:col-span-1">
              <div className="flex gap-4 justify-center items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded-full"
                />
                <p className="text-sm text-black dark:text-white">{product.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2">
              <p className="text-sm text-black dark:text-white">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">
                {product.category}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">
                {product.price}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">
                {product.discountPrice}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1 sm:col-span-1">
              <p className="text-sm text-black dark:text-white">
                {product.stockQuantity}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                className="hover:text-primary"
                onClick={() => {
                  setEditProduct(product);
                  setShowModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button className="hover:text-primary">
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                    fill=""
                  />
                  <path
                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <ProductModal
            product={editProduct}
            onClose={() => setShowModal(false)}
            onSave={editProduct ? handleEditProduct : handleAddProduct}
            categories={[]}
          />
        )}
      </div>
    </>
  );
};

export default Products;
