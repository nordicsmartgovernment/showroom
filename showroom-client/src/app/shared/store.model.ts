export interface Store {
  id: string;
  name: string;
  type: string;
  inventory: Product[];
  currency: string;
  icon?: string;
}

export interface Product {
  name: string;
  price: number;
}
