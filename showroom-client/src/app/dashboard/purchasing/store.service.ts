import { Store } from './store.model';

export class StoreService {

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
    { name: 'Electric Drill', cost: 25 },
    { name: 'Circular Saw', cost: 42 },
    { name: 'Oscillating Multitool', cost: 39 }
  ],
  icon: 'hammer-screwdriver'
};

const STORE_2: Store = {
  id: 'buildersparadise',
  name: 'Builder\'s Paradise',
  type: 'Building material store',
  inventory: [
    { name: 'Drywall piece', cost: 95 },
    { name: 'Flooring', cost: 19 },
  ],
  icon: 'hammer-wrench'
};

const STORE_3: Store = {
  id: 'fruit4you',
  name: 'Fruit4You',
  type: 'Food wholesales store',
  inventory: [
    { name: 'Apple', cost: 2 },
    { name: 'Orange', cost: 19 },
    { name: 'Pomelo', cost: 15 },
  ],
  icon: 'food-apple'
};
