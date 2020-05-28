import { Injectable } from '@angular/core';

export interface Company {
  name: string;
  id: number;
  vatId: string;
  country: string;
  iban: string;
}

export const BEST_POWER_TOOLS = {
  id: 3891382,
  name: 'BestPowerTools',
  iban: 'NO000000000742783',
  vatId: 'NO742783',
  country: 'NO',
};

export const BUILDERS_PARADISE = {
  id: 994023491,
  name: 'Builder\'s Paradise',
  type: 'Hardware store',
  iban: 'FI000000000479234',
  vatId: 'FI479234',
  country: 'FI'
};

export const FRUIT_4_YOU = {
  id: 77772231,
  name: 'Fruit4You',
  iban: 'DK000000000038491',
  vatId: 'DK038491',
  country: 'DK'
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private ALL_COMPANIES = [
    {
      name: 'ABC Ltd',
      id: 123456,
      vatId: 'NO123456',
      country: 'NO',
      iban: 'NO00000000012345'
    },
    {
      name: 'XYZ Corp.',
      id: 335577,
      vatId: 'FI335577',
      country: 'FI',
      iban: 'FI000000000335577'
    },
    {
      name: 'Köttbullar AB',
      id: 994422,
      vatId: 'SE31-2378',
      country: 'SE',
      iban: 'SE000000000312378'
    },
    BEST_POWER_TOOLS,
    BUILDERS_PARADISE,
    FRUIT_4_YOU
  ];

  private actingCompany: Company;

  constructor() {
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
  }

  getAllCompanies(): Company[] {
    return this.ALL_COMPANIES.slice();
  }

}
