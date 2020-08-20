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
    const currency = this.getCurrency(fromConutryOrCurrency);
    const toCurrency = this.getActingCompanyCurrency();
    return this.convertCurrency(amount, toCurrency, currency);
  }

  convertCurrency(amount: number, fromCurrencyOrCountry: string,
                  toCurrencyOrCountry: string): number {
    const fromCurrency = this.getCurrency(fromCurrencyOrCountry);
    const toCurrency = this.getCurrency(toCurrencyOrCountry);
    return round((amount * this.currencyEuroValue.get(toCurrency)) / this.currencyEuroValue.get(fromCurrency));
  }

  getActingCompanyCurrency() {
    return this.countryCurrencymap.get(this.actingCompany.country);
  }

  getCurrency(countryOrCurrency: string) {
    if (this.countryCurrencymap.get(countryOrCurrency)) {
      return this.countryCurrencymap.get(countryOrCurrency);
    } else {
      return countryOrCurrency;
    }
  }
}

