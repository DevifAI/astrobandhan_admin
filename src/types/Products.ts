// src/types/Products.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;  // Ensure price is a number (not nullable)
  discountPrice: number; // Ensure discountPrice is a number (not nullable)
  stockQuantity: number; // Ensure stockQuantity is a number (not nullable)
  image: string;
}
