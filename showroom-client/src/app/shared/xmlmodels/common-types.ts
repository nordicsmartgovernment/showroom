import {formatDate} from '@angular/common';

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
