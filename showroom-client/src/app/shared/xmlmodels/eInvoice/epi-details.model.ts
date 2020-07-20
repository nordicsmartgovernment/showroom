import {AppXmlDate, CurrencyAmount, IdentityWithScheme} from '../common-types';
import {Product, Store} from '../../store.model';
import {PurchaseDescription} from '../../sandbox.service';

export class EpiDetailsModel {

  epiIdentificationDetails = new EpiIdentificationDetails();
  epiPartyDetails = new EpiPartyDetails();
  epiPaymentInstructionDetails = new EpiPaymentInstructionDetails();

  parsableObject() {
    return {
      EpiIdentificationDetails: this.epiIdentificationDetails.parsableObject(),
      EpiPartyDetails: this.epiPartyDetails.parsableObject(),
      EpiPaymentInstructionDetails: this.epiPaymentInstructionDetails.parsableObject(),
    };
  }

  generate(product: Product, purchase: PurchaseDescription, seller: Store, paymentReference: string) {
    this.epiIdentificationDetails.generate();
    this.epiPartyDetails.generate(seller);
    this.epiPaymentInstructionDetails.generate(purchase, paymentReference, seller.currency);
  }
}

class EpiIdentificationDetails {
  epiDate = new AppXmlDate();
  epiReference: string;

  parsableObject() {
    return {
      EpiDate: this.epiDate.parsableObject(),
      EpiReference: this.epiReference,
    };
  }

  generate() {
    this.epiReference = '';
    this.epiDate.setToRelativeDaysFromCurrent(14);
  }
}

class EpiPartyDetails {
  epiBfiPartyDetails: string;
  epiBeneficiaryPartyDetails = new EpiBeneficiaryPartyDetails();

  parsableObject() {
    return {
      EpiBeneficiaryPartyDetails: this.epiBeneficiaryPartyDetails.parsableObject(),
      EpiBfiPartyDetails: this.epiBfiPartyDetails,
    };
  }

  generate(seller: Store) {
    this.epiBfiPartyDetails = '';
    this.epiBeneficiaryPartyDetails.generate(seller.name);
  }
}

class EpiBeneficiaryPartyDetails {
  epiNameAddressDetails: string;
  epiAccountID = new IdentityWithScheme();

  parsableObject() {
    return {
      EpiAccountID: this.epiAccountID.parsableObject(),
      EpiNameAddressDetails: this.epiNameAddressDetails,
    };
  }

  generate(sellerName: string) {
    this.epiNameAddressDetails = sellerName;
    this.epiAccountID.identificationSchemeName = 'IBAN';
    this.epiAccountID.identity = 'FI04904840131313';
  }
}


class EpiPaymentInstructionDetails {
  epiCharge = new EpiCharge();
  epiDateOptionDate = new AppXmlDate();
  epiInstructedAmount = new CurrencyAmount();
  epiPaymentInstructionId: string;
  epiRemittanceInfoIdentifier = new IdentityWithScheme();

  parsableObject() {
    return {
      EpiPaymentInstructionId: this.epiPaymentInstructionId,
      EpiRemittanceInfoIdentifier: this.epiRemittanceInfoIdentifier.parsableObject(),
      EpiInstructedAmount: this.epiInstructedAmount.parsableObject(),
      EpiCharge: this.epiCharge.parsableObject(),
      EpiDateOptionDate: this.epiDateOptionDate.parsableObject(),
    };
  }

  generate(purchase: PurchaseDescription, paymentReference: string, currency: string) {
    this.epiPaymentInstructionId = '';
    this.epiRemittanceInfoIdentifier.identificationSchemeName = 'ISO';
    this.epiRemittanceInfoIdentifier.identity = '11002';
    this.epiInstructedAmount.currencyIdentifier = currency;
    this.epiInstructedAmount.amount = purchase.totalPriceInclVat;
    this.epiCharge.chargeOption = 'SHA';
    this.epiDateOptionDate.setToCurrentDate();
  }
}

class EpiCharge {
  // TODO are the fields always the same?
  chargeOption: string;

  parsableObject() {
    return {
      EpiCharge: {_text_: this.chargeOption, __ChargeOption: this.chargeOption}
    };
  }
}
