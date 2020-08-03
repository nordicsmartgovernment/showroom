import {formatDate} from '@angular/common';
import {PurchaseDescription} from '../sandbox.service';
import {Product} from '../store.model';

export class CurrencyAmount {
  // tslint:disable-next-line:variable-name
  __AmountCurrencyIdentifier = '';
  // tslint:disable-next-line:variable-name
  _text_ = 0;

  set(amount: number, currencyIdentifier: string) {
    // Round down to two decimal places
    this._text_ = Math.round(amount * 100) / 100;
    this.__AmountCurrencyIdentifier = currencyIdentifier;
  }
}


export class AppXmlDate {
  // tslint:disable-next-line:variable-name
  __Format = 'CCYYMMDD';
  // tslint:disable-next-line:variable-name
  _text_ = 0;

  setToCurrentDate() {
    this.setDate(new Date());
  }

  setToRelativeDaysFromCurrent(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    this.setDate(date);
  }

  private setDate(date: Date) {
    this._text_ = parseInt(formatDate(date, 'yyyyMMdd', 'en-en'), 10);
  }
}

export class Quantity {
  // tslint:disable-next-line:variable-name
  __QuantityUnitCode = '';
  // tslint:disable-next-line:variable-name
  _text_ = 0;
}

export class IdentityWithScheme {
  // tslint:disable-next-line:variable-name
  __IdentificationSchemeName = '';
  // tslint:disable-next-line:variable-name
  _text_ = '';
}

export class VatSpecificationDetails {
  VatBaseAmount = new CurrencyAmount();
  VatRatePercent = '';
  VatCode = '';
  VatRateAmount = new CurrencyAmount();

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.VatBaseAmount.set(purchase.totalPriceExclVat, currency);
    this.VatRatePercent = `${product.vatRate}.00`;
    this.VatCode = 'S';
    this.VatRateAmount.set(purchase.vatPrice, currency);
  }
}
