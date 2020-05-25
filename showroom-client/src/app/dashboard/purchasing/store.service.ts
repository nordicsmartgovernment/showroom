import { Injectable } from '@angular/core';
import { Store } from '../../shared/store.model';
import { BEST_POWER_TOOLS, BUILDERS_PARADISE, FRUIT_4_YOU } from '../../shared/company.service';

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
    { name: 'Electric Drill', price: 25 },
    { name: 'Circular Saw', price: 42 },
    { name: 'Oscillating Multitool', price: 39 }
  ],
  icon: 'hammer-screwdriver'
};

const STORE_2: Store = {
  ...BUILDERS_PARADISE,
  type: 'Building material store',
  currency: 'EUR',
  inventory: [
    { name: 'Drywall piece', price: 95 },
    { name: 'Flooring', price: 19 },
  ],
  icon: 'hammer-wrench'
};

const STORE_3: Store = {
  ...FRUIT_4_YOU,
  type: 'Food wholesales store',
  currency: 'DKK',
  inventory: [
    { name: 'Apple', price: 2 },
    { name: 'Orange', price: 19 },
    { name: 'Pomelo', price: 15 },
  ],
  icon: 'food-apple'
};
