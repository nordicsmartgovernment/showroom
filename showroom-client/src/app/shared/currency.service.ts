import {Injectable} from '@angular/core';
import {Company, CompanyService} from './company.service';
import {round} from './utils/vatUtil';

@Injectable({providedIn: 'root'})
export class CurrencyService {
  actingCompany: Company;
  private readonly countryCurrencymap = new Map<string, string>(
    [
      ['DK', 'DKK'],
      ['IS', 'ISK'],
      ['SE', 'SEK'],
      ['FI', 'EUR'],
      ['NO', 'NOK'],
    ]
  );

  private readonly currencyEuroValue = new Map<string, number>(
    [
      ['DKK', 0.133],
      ['ISK', 0.007],
      ['SEK', 0.094],
      ['EUR', 1],
      ['NOK', 0.101],
    ]
  );

  constructor(private companyService: CompanyService) {
    this.actingCompany = companyService.getActingCompany();
    companyService.actingCompanyChanged.subscribe(company => this.actingCompany = company);
  }

  convertToActingCompanyCurrency(amount: number, fromConutryOrCurrency: string): number {
    let currency;
    if (this.countryCurrencymap.get(fromConutryOrCurrency)) {
      currency = this.countryCurrencymap.get(fromConutryOrCurrency);
    } else {
      currency = fromConutryOrCurrency;
    }
    const toCurrency = this.getActingCompanyCurrency();
    return this.convertCurrency(amount, toCurrency, currency);
  }

  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    return round((amount * this.currencyEuroValue.get(toCurrency)) / this.currencyEuroValue.get(fromCurrency));
  }

  getActingCompanyCurrency() {
    return this.countryCurrencymap.get(this.actingCompany.country);
  }
}

