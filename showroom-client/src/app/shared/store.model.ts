import { Company } from './company.service';

export interface Store extends Company {
  type: string;
  storeInventory: Product[];
  currency: string;
  icon?: string;
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
}
