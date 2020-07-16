export class CurrencyAmount {
  currencyIdentifier: string;
  amount: string;

  parsableObject() {
    return {
      __AmountCurrencyidentifier: this.currencyIdentifier,
      _text_: this.amount
    };
  }
}


export class AppXmlDate {
  format = 'CCMMYYDD';
  date: string;

  parsableObject() {
    return {
      _text_: this.date,
      __Format: this.format
    };
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
