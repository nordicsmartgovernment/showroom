import {AppXmlDate, CurrencyAmount, IdentityWithScheme} from './common-types';
import {Product, Store} from '../store.model';
import {PurchaseDescription} from '../sandbox.service';

export class EpiDetailsModel {

  EpiIdentificationDetails = new EpiIdentificationDetails();
  EpiPartyDetails = new EpiPartyDetails();
  EpiPaymentInstructionDetails = new EpiPaymentInstructionDetails();

  generate(product: Product, purchase: PurchaseDescription, seller: Store, paymentReference: string) {
    this.EpiIdentificationDetails.generate();
    this.EpiPartyDetails.generate(seller);
    this.EpiPaymentInstructionDetails.generate(purchase, paymentReference, seller.currency);
  }
}

class EpiIdentificationDetails {
  EpiDate = new AppXmlDate();
  EpiReference = '';

  generate() {
    this.EpiReference = '';
    this.EpiDate.setToRelativeDaysFromCurrent(14);
  }
}

class EpiPartyDetails {
  EpiBfiPartyDetails = '';
  EpiBeneficiaryPartyDetails = new EpiBeneficiaryPartyDetails();

  generate(seller: Store) {
    this.EpiBfiPartyDetails = '';
    this.EpiBeneficiaryPartyDetails.generate(seller.name);
  }
}

class EpiBeneficiaryPartyDetails {
  EpiNameAddressDetails = '';
  EpiAccountID = new IdentityWithScheme();

  generate(sellerName: string) {
    this.EpiNameAddressDetails = sellerName;
    this.EpiAccountID.__IdentificationSchemeName = 'IBAN';
    this.EpiAccountID._text_ = 'FI04904840131313';
  }
}


class EpiPaymentInstructionDetails {
  EpiPaymentInstructionId = '';
  EpiRemittanceInfoIdentifier = new IdentityWithScheme();
  EpiInstructedAmount = new CurrencyAmount();
  EpiCharge = new EpiCharge();
  EpiDateOptionDate = new AppXmlDate();

  generate(purchase: PurchaseDescription, paymentReference: string, currency: string) {
    this.EpiPaymentInstructionId = '';
    this.EpiRemittanceInfoIdentifier.__IdentificationSchemeName = 'ISO';
    this.EpiRemittanceInfoIdentifier._text_ = paymentReference;
    this.EpiInstructedAmount.set(purchase.totalPriceInclVat, currency);
    this.EpiCharge.__ChargeOption = 'SHA';
    this.EpiCharge._text_ = 'SHA';
    this.EpiDateOptionDate.setToCurrentDate();
  }
}

class EpiCharge {
  // tslint:disable-next-line:variable-name
  _text_ = '';
  // tslint:disable-next-line:variable-name
  __ChargeOption = '';
}
