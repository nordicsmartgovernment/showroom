import {formatDate} from '@angular/common';
import {PurchaseDescription} from '../sandbox.service';
import {Product} from '../store.model';

export class CurrencyAmount {
  // tslint:disable-next-line:variable-name
  __AmountCurrencyidentifier: string;
  // tslint:disable-next-line:variable-name
  _text_: number;

  set(amount: number, currencyIdentifier: string) {
    // Round down to two decimal places
    this._text_ = Math.round(amount * 100) / 100;
    this.__AmountCurrencyidentifier = currencyIdentifier;
  }
}


export class AppXmlDate {
  // tslint:disable-next-line:variable-name
  __Format = 'CCYYMMDD';
  // tslint:disable-next-line:variable-name
  _text_: number;

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
  quantityUnitCode: string;
  quantity: number;
}

export class IdentityWithScheme {
  // tslint:disable-next-line:variable-name
  __IdentificationSchemeName: string;
  // tslint:disable-next-line:variable-name
  _text_: string;
}

export class VatSpecificationDetails {
  VatBaseAmount = new CurrencyAmount();
  VatRatePercent: string;
  VatCode: string;
  VatRateAmount = new CurrencyAmount();

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.VatBaseAmount.set(purchase.totalPriceExclVat, currency);
    this.VatRatePercent = `${product.vatRate}.00`;
    this.VatCode = 'S';
    this.VatRateAmount.set(purchase.vatPrice, currency);
  }
}
