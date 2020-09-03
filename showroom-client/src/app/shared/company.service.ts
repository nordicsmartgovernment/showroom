import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {InventoryProduct} from './inventory.model';
import {Order} from '../dashboard/ordering/order.component';

export class Company {

  name: string;
  id: number;
  vatId: string;
  country: string;
  iban: string;
  postCodeIdentifier: string;
  streetName: string;
  townName: string;
  backgroundImage: string;
  orders: Order[] = [];
  inventory: InventoryProduct[] = [];

  constructor({id, name, vatId, country, iban, postCodeIdentifier, streetName, townName, inventory, backgroundImage}
                : {
                id: number,
                name: string,
                vatId: string,
                country: string,
                iban: string,
                postCodeIdentifier: string,
                streetName: string,
                townName: string,
                backgroundImage?: string,
                inventory?: InventoryProduct[],
              },
  ) {
    this.id = id;
    this.name = name;
    this.iban = iban;
    this.vatId = vatId;
    this.country = country;
    this.postCodeIdentifier = postCodeIdentifier;
    this.streetName = streetName;
    this.townName = townName;
    if (inventory) {
      this.inventory = inventory;
    }
    this.backgroundImage = backgroundImage;
  }
}

export const BEST_POWER_TOOLS = new Company({
  id: 3891382,
  name: 'BestPowerTools',
  iban: 'NO000000000742783',
  vatId: 'NO742783',
  country: 'NO',
  postCodeIdentifier: '0660',
  streetName: 'Verktøygata 1',
  townName: 'Oslo',
  backgroundImage: 'assets/img/stores/best-power-tools/shop-splash.jpg',
});
export const BUILDERS_PARADISE = new Company({
  id: 994023491,
  name: 'Rakentajan paratiisi',
  iban: 'FI000000000479234',
  vatId: 'FI479234',
  country: 'FI',
  postCodeIdentifier: '01510',
  streetName: 'Laamannintie 1',
  townName: 'Helsingfors',
  backgroundImage: 'assets/img/stores/builders-paradise/shop-splash.jpg',
});

export const FRUIT_4_YOU = new Company({
  id: 77772231,
  name: 'Fruit4You',
  iban: 'DK000000000038491',
  vatId: 'DK038491',
  country: 'DK',
  postCodeIdentifier: '8000',
  streetName: 'Viborgvej 2',
  townName: 'Århus',
  backgroundImage: 'assets/img/stores/fruit4u/shop-splash.jpg',
});

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  actingCompanyChanged = new Subject<Company>();
  private readonly COMPANY_STORAGE_KEY = 'companies';

  private ALL_COMPANIES = [
    new Company({
      name: 'ABC Ltd',
      id: 123456,
      vatId: 'NO123456',
      country: 'NO',
      iban: 'NO00000000012345',
      postCodeIdentifier: '0660',
      streetName: 'Verktøygata 2',
      townName: 'Oslo',
      backgroundImage: 'assets/img/companies/abc/splash.jpg',
    }),
    new Company({
      name: 'XYZ Corp.',
      id: 335577,
      vatId: 'FI335577',
      country: 'FI',
      iban: 'FI000000000335577',
      postCodeIdentifier: '01510',
      streetName: 'Laamannintie 2',
      townName: 'Helsingfors',
      backgroundImage: 'assets/img/companies/xyz/splash.jpg',
    }),
    new Company({
      name: 'Köttbullar AB',
      id: 994422,
      vatId: 'SE31-2378',
      country: 'SE',
      iban: 'SE000000000312378',
      postCodeIdentifier: '11640',
      streetName: 'Nytorgsgatan 1',
      townName: 'Stockholm',
      backgroundImage: 'assets/img/companies/koetbullar/splash.jpg',
    }),
    BEST_POWER_TOOLS,
    BUILDERS_PARADISE,
    FRUIT_4_YOU
  ];

  private actingCompany: Company;

  constructor() {
    this.restoreCompanies();
    // Just pick the first company as default
    // Acting company is a good candidate for local storage (making it persistent across sessions)
    this.actingCompany = this.ALL_COMPANIES[0];
  }

  // This should probably be an observable, so you don't have to poll for changes
  getActingCompany(): Company {
    return this.actingCompany;
  }

  actAsCompany(id: number) {
    this.actingCompany = this.ALL_COMPANIES.find(c => c.id === id);
    this.actingCompanyChanged.next(this.actingCompany);
  }

  getAllCompanies(): Company[] {
    return this.ALL_COMPANIES.slice();
  }

  getCompany(id: string | number): Company {
    if (typeof id === 'number') {
      id = id.toString();
    }
    return this.getAllCompanies().find(s => s.id.toString() === id);
  }

  saveCompanies() {
    localStorage.setItem(this.COMPANY_STORAGE_KEY, JSON.stringify(this.ALL_COMPANIES));
  }

  restoreCompanies() {
    const storedCompanies = localStorage.getItem(this.COMPANY_STORAGE_KEY);
    if (storedCompanies && storedCompanies !== '{}') {
      this.ALL_COMPANIES = JSON.parse(storedCompanies);
    }
  }

}
