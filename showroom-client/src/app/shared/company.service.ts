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

  constructor() {
  }

  getCurrentCompany(): Company {
    return {
      name: 'ABC Ltd',
      id: 123456,
      vatId: 'NO123456',
      country: 'NO'
    };
  }

}
