import {Injectable} from '@angular/core';
import {Product, Store} from './store.model';
import {BEST_POWER_TOOLS, BUILDERS_PARADISE, CompanyService, FRUIT_4_YOU} from './company.service';
import {InventoryProduct} from './inventory.model';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly HAS_INITIALIZED_KEY = 'hasInitializedStoreInventory';

  constructor(private companyService: CompanyService) {
    this.initializeStoreInventory(companyService);
  }

  createStoreBaseInventoryStock(store: Store): InventoryProduct[] {
    return store.storeProductSelection.map(product => {
        // number between 20 and 100 divisible by 10
        const amount = Math.round(Math.random() * 8) * 10 + 20;

        return new InventoryProduct(
          product.itemName,
          amount,
          product.quantityCode,
          product.price * amount,
          store.currency,
          parseInt(formatDate(new Date(), 'yyyyMMdd', 'en-en'), 10));
      }
    );
  }

  getStores(): Store[] {
    // Static stores - should be parsed from XMl later
    return [STORE_1, STORE_2, STORE_3];
  }

  getStore(id: string | number): Store {
    if (typeof id === 'number') {
      id = id.toString();
    }
    return this.getStores().find(s => s.id.toString() === id);
  }

  private initializeStoreInventory(companyService: CompanyService) {
    const hasInitialized = localStorage.getItem(this.HAS_INITIALIZED_KEY);
    if (!hasInitialized || hasInitialized !== 'true') {
      this.getStores()
        .forEach(store => {
          const company = companyService.getCompany(store.id);
          company.inventory = this.createStoreBaseInventoryStock(store);
          companyService.saveCompanies();
        });
      localStorage.setItem(this.HAS_INITIALIZED_KEY, 'true');
    }
  }

  findProduct(productId: number): Product {
    let foundProduct: Product = null;
    this.getStores().forEach(
      store => store.storeProductSelection.forEach(
        product => {
          if (product.standardItemID === '' + productId) {
            foundProduct = product;
          }
        }
      )
    );
    return foundProduct;
  }
}


const STORE_1: Store = {
  ...BEST_POWER_TOOLS,
  type: 'Hardware store',
  currency: 'NOK',
  storeProductSelection: [
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
  icon: 'hammer-screwdriver',
  splashImage: 'assets/img/stores/best-power-tools/shop-splash.jpg',
  description: 'Are your tools breaking when you walk out the store? Come get some proper tools!',
};

const STORE_2: Store = {
  ...BUILDERS_PARADISE,
  type: 'Building material store',
  currency: 'EUR',
  storeProductSelection: [
    {
      itemName: 'Drywall piece',
      price: 95,
      commodityCode: '30161503',
      originCountry: 'FI',
      sellerItemID: '8085256',
      standardItemID: '83111506',
      vatRate: 25,
      quantityCode: 'PCS',
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
  icon: 'hammer-wrench',
  splashImage: 'assets/img/stores/builders-paradise/shop-splash.jpg',
  description: 'Are you a builder? Get solid materials at a good price.'
};

const STORE_3: Store = {
  ...FRUIT_4_YOU,
  type: 'Food wholesales store',
  currency: 'DKK',
  storeProductSelection: [
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
      quantityCode: 'KGS',
      image: 'assets/img/stores/fruit4u/products/pink-pomelo.jpg'
    },
  ],
  icon: 'food-apple',
  splashImage: 'assets/img/stores/fruit4u/shop-splash.jpg',
  description: 'Want to get healthy? Here is some fruit 4 you',
};
