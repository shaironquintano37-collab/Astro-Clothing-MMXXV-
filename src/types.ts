export type Category = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  backImage?: string;
  additionalImages?: string[];
  description: string;
  sizes: string[];
  colors?: string[];
}

export interface CartItem extends Product {
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}
