import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const SANDBOX_URL = 'https://nsg.fellesdatakatalog.brreg.no/';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {

  constructor(private http: HttpClient) {
  }

  getCompanyIds() {
    return this.http.get(SANDBOX_URL + 'transactions');
  }
}
