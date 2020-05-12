export interface Store {
  id: string;
  name: string;
  type: string;
  inventory: Product[];
  icon?: string;
}

export interface Product {
  name: string;
  cost: number;
}
