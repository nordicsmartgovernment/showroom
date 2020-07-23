import {formatDate} from '@angular/common';
import {PurchaseDescription} from '../sandbox.service';
import {Product} from '../store.model';

export class CurrencyAmount {
  // tslint:disable-next-line:variable-name
  __AmountCurrencyidentifier: string;
  // tslint:disable-next-line:variable-name
  _text_: string;

  set(amount: number, currencyIdentifier: string) {
    this._text_ = amount.toFixed(2).replace('.', ',');
    this.__AmountCurrencyidentifier = currencyIdentifier;
  }
}


export class AppXmlDate {
  // tslint:disable-next-line:variable-name
  __Format = 'CCYYMMDD';
  // tslint:disable-next-line:variable-name
  _text_: string;

  setToCurrentDate() {
    this.setDate(new Date());
  }

  setToRelativeDaysFromCurrent(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    this.setDate(date);
  }

  private setDate(date: Date) {
    this._text_ = formatDate(date, 'yyyyMMdd', 'en-en');
  }
}

export class Quantity {
  quantityUnitCode: string;
  quantity: number;

  parsableObject() {
    return {
      _text_: this.quantity,
      __IdentificationSchemeName: this.quantityUnitCode
    };
  }

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
    this.VatRatePercent = `${product.vatRate},00`;
    this.VatCode = 'S';
    this.VatRateAmount.set(purchase.vatPrice, currency);
  }
}
