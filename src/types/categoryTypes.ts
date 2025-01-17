export type Category = {
    _id: string;
    category_name: string;
    no_of_items?: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type NewCategory = Omit<Category, '_id' | 'createdAt' | 'updatedAt'>;
  
  export type CategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSubmit: (categoryData: NewCategory & Partial<Pick<Category, '_id'>>) => Promise<void>;
  };