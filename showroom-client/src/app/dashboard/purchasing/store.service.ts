import {Injectable} from '@angular/core';
import {Store} from '../../shared/store.model';
import {BEST_POWER_TOOLS, BUILDERS_PARADISE, FRUIT_4_YOU} from '../../shared/company.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() {
  }

  getStores(): Store[] {
    // Static stores - should be parsed from XMl later
    return [STORE_1, STORE_2, STORE_3];
  }

  getStore(id: string): Store {
    return this.getStores().find(s => s.id.toString() === id);
  }

}


const STORE_1: Store = {
  ...BEST_POWER_TOOLS,
  type: 'Hardware store',
  currency: 'NOK',
  inventory: [
    {
      itemName: 'Electric Drill',
      price: 25,
      commodityCode: '50310000',
      originCountry: 'NO',
      sellerItemID: '8085253',
      standardItemID: '27112700',
      vatRate: 25,
      quantityCode: 'PCS'
    },
    {
      itemName: 'Circular Saw',
      price: 42,
      commodityCode: '23231200',
      originCountry: 'NO',
      sellerItemID: '8085254',
      standardItemID: '83111504',
      vatRate: 25,
      quantityCode: 'PCS'
    },
    {
      itemName: 'Oscillating Multitool',
      price: 39,
      commodityCode: '50310000',
      originCountry: 'NO',
      sellerItemID: '8085255',
      standardItemID: '27112700',
      vatRate: 25,
      quantityCode: 'PCS'
    }
  ],
  icon: 'hammer-screwdriver'
};

const STORE_2: Store = {
  ...BUILDERS_PARADISE,
  type: 'Building material store',
  currency: 'EUR',
  inventory: [
    {
      itemName: 'Drywall piece',
      price: 95,
      commodityCode: '30161503',
      originCountry: 'FI',
      sellerItemID: '8085256',
      standardItemID: '83111506',
      vatRate: 25,
      quantityCode: 'PCS'
    },
    {
      itemName: 'Flooring',
      price: 19,
      commodityCode: '30161700',
      originCountry: 'FI',
      sellerItemID: '8085257',
      standardItemID: '83111507',
      vatRate: 25,
      quantityCode: 'SQM'
    },
  ],
  icon: 'hammer-wrench'
};

const STORE_3: Store = {
  ...FRUIT_4_YOU,
  type: 'Food wholesales store',
  currency: 'DKK',
  inventory: [
    {
      itemName: 'Apple',
      price: 2,
      commodityCode: '50301500',
      originCountry: 'DK',
      sellerItemID: '8085258',
      standardItemID: '83111508',
      vatRate: 15,
      quantityCode: 'KGS'
    },
    {
      itemName: 'Orange',
      price: 19,
      commodityCode: '50305000',
      originCountry: 'DK',
      sellerItemID: '8085259',
      standardItemID: '83111509',
      vatRate: 15,
      quantityCode: 'KGS'
    },
    {
      itemName: 'Pink Pomelo',
      price: 15,
      commodityCode: '50306005',
      originCountry: 'DK',
      sellerItemID: '8085210',
      standardItemID: '83111510',
      vatRate: 15,
      quantityCode: 'KGS'
    },
  ],
  icon: 'food-apple'
};
