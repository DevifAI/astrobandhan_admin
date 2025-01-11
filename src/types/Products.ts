export interface Category {
  _id: string;
  category_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  contains: any[];
  total_stock: number;
  _id: string;
  productName: string;
  image: string;
  productDescription: string;
  category: Category;
  rating: number;
  brand: string;
  weight: string;
  material: string;
  originalPrice: number;
  displayPrice: number;
  in_stock: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}