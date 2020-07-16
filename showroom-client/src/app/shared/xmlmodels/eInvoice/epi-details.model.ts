import {AppXmlDate, CurrencyAmount, IdentityWithScheme} from '../common-types';

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
}

class EpiPartyDetails {
  epiAccountID = new IdentityWithScheme();
  epiNameAddressDetails: string;

  parsableObject() {
    return {
      EpiAccountID: this.epiAccountID.parsableObject(),
      EpiNameAddressDetails: this.epiNameAddressDetails,
    };
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
      EpiCharge: this.epiCharge.parsableObject(),
      EpiDateOptionDate: this.epiDateOptionDate.parsableObject(),
      EpiInstructedAmount: this.epiInstructedAmount.parsableObject(),
      EpiPaymentInstructionId: this.epiPaymentInstructionId,
      EpiRemittanceInfoIdentifier: this.epiRemittanceInfoIdentifier.parsableObject(),
    };
  }

  /*
EpiCharge
EpiDateOptionDate
EpiInstructedAmount
EpiPaymentInstructionId
EpiRemittanceInfoIdentifier
  * */
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
