export type Category = {
    imageUrl: string;
    _id: string;
    category_name: string;
    no_of_items?: number;
    createdAt: string;
    updatedAt: string;
    image?: string;
  };
  
  export type NewCategory = {
    category_name: string;
    no_of_items?: number;
    imageUrl?: string;
  }
  
  export type CategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onHandleSubmit: (data: any) => Promise<void>;
  };