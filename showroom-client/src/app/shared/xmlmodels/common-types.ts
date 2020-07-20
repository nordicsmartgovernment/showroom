import {formatDate} from '@angular/common';

export class CurrencyAmount {
  currencyIdentifier: string;
  amount: number;

  parsableObject() {
    return {
      __AmountCurrencyidentifier: this.currencyIdentifier,
      _text_: this.amount.toFixed(2).replace('.', ','),
    };
  }
}


export class AppXmlDate {
  format = 'CCYYMMDD';
  date: string;

  parsableObject() {
    return {
      _text_: this.date,
      __Format: this.format
    };
  }

  setToCurrentDate() {
    this.setDate(new Date());
  }

  setToRelativeDaysFromCurrent(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    this.setDate(date);
  }

  private setDate(date: Date) {
    this.date = formatDate(date, 'yyyyMMdd', 'en-en');
    console.log(this.date);
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
  identificationSchemeName: string;
  identity: string;

  parsableObject() {
    return {
      _text_: this.identity,
      __IdentificationSchemeName: this.identificationSchemeName
    };
  }
}
