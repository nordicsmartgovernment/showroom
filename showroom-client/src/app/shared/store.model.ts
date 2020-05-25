import { Company } from './company.service';

export interface Store extends Company {
  type: string;
  inventory: Product[];
  currency: string;
  icon?: string;
}

export interface Product {
  name: string;
  price: number;
}
