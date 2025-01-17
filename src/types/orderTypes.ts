type User = {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    password: string;
    timeOfBirth: string;
    placeOfBirth: string;
    gender: string;
    phone: string;
    walletBalance: number;
    Free_Chat_Available: boolean;
    followed_astrologers: any[];
    consultations: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    refreshToken: string;
    photo: string;
  };
  
  type OrderDetails = {
    contains: any[];
    total_stock: number;
    _id: string;
    productName: string;
    image: string;
    productDescription: string;
    category: string;
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
  };
  
  type Order = {
    _id: string;
    userId: User;
    name: string;
    city: string;
    state: string;
    phone: string;
    order_details: OrderDetails;
    delivery_date: string;
    is_order_complete: boolean;
    quantity: number;
    total_price: number;
    payment_method: string;
    is_payment_done: boolean;
    transaction_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  
 export type OrdersData = {
    data: Order[];
  };
  