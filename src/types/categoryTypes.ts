export type Category = {
    imageUrl: string;
    _id: string;
    category_name: string;
    totalItems?: number;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
  };
  
  export type NewCategory = {
    category_name: string;
    totalItems?: number;
    imageUrl?: string;
  }
  
  export type CategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    fetchCategories: () => void;
    // onHandleSubmit: (data: any) => Promise<void>;
  };