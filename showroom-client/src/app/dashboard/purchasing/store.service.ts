import { Store } from './store.model';
import { Injectable } from '@angular/core';

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
    return this.getStores().find(s => s.id === id);
  }

}


const STORE_1: Store = {
  id: 'bestpowertools',
  name: 'BestPowerTools',
  type: 'Hardware store',
  inventory: [
    { name: 'Electric Drill', price: 25 },
    { name: 'Circular Saw', price: 42 },
    { name: 'Oscillating Multitool', price: 39 }
  ],
  icon: 'hammer-screwdriver'
};

const STORE_2: Store = {
  id: 'buildersparadise',
  name: 'Builder\'s Paradise',
  type: 'Building material store',
  inventory: [
    { name: 'Drywall piece', price: 95 },
    { name: 'Flooring', price: 19 },
  ],
  icon: 'hammer-wrench'
};

const STORE_3: Store = {
  id: 'fruit4you',
  name: 'Fruit4You',
  type: 'Food wholesales store',
  inventory: [
    { name: 'Apple', price: 2 },
    { name: 'Orange', price: 19 },
    { name: 'Pomelo', price: 15 },
  ],
  icon: 'food-apple'
};
