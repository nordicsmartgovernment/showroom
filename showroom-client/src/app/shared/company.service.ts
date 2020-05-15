import { Injectable } from '@angular/core';

export interface Company {
  name: string;
  id: number;
  vatId: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private ALL_COMPANIES = [
    {
      name: 'ABC Ltd',
      id: 123456,
      vatId: 'NO123456',
      country: 'NO'
    },
    {
      name: 'XYZ Corp.',
      id: 335577,
      vatId: 'FI335577',
      country: 'FI'
    },
    {
      name: 'Köttbullar AB',
      id: 994422,
      vatId: 'SE31-2378',
      country: 'SE'
    }
  ];

  private actingCompany: Company;

  constructor() {
    this.actingCompany = this.ALL_COMPANIES[0];
  }

  // This should probably be an observable, so you don't have to poll for changes
  getActingCompany(): Company {
    return this.actingCompany;
  }

  actAsCompany(id: number) {
    this.actingCompany = this.ALL_COMPANIES.find(c => c.id === id);
  }

  getAllCompanies(): Company[] {
    return this.ALL_COMPANIES.slice();
  }

}
