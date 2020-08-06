import { Company } from './company.service';

export interface Store extends Company {
  type: string;
  storeProductSelection: Product[];
  currency: string;
  icon?: string;
  splashImage?: string;
  description?: string;
}

export interface Product {
  itemName: string;
  price: number;
  sellerItemID: string;
  standardItemID: string;
  originCountry: string;
  commodityCode: string;
  vatRate: number;
  quantityCode: string;
  image?: string;
}
