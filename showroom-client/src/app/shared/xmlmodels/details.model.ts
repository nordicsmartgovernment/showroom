export class BuyerPartyDetailsModel {
  buyerOrganisationName: string;
  buyerOrganisationTaxCode: string;
  buyerPartyIdentifier: string;
  buyerPostalAddressDetails = new BuyerPostalAddressDetails();

  parsableObject() {
    return {
      BuyerOrganisationName: this.buyerOrganisationName,
      BuyerOrganisationTaxCode: this.buyerOrganisationTaxCode,
      BuyerPartyIdentifier: this.buyerPartyIdentifier,
      BuyerPostalAddressDetails: this.buyerPostalAddressDetails.parsableObject()
    };
  }
}

class BuyerPostalAddressDetails {
  buyerPostCodeIdentifier: number;
  buyerStreetName: string;
  buyerTownName: string;
  countryCode: string;

  parsableObject() {
    return {
      BuyerPostCodeIdentifier: this.buyerPostCodeIdentifier,
      BuyerStreetName: this.buyerStreetName,
      BuyerTownName: this.buyerTownName,
      CountryCode: this.countryCode
    };
  }
}

export class SellerPartyDetailsModel {
  sellerOrganisationName: string;
  sellerOrganisationTaxCode: string;
  sellerPartyIdentifier: string;
  sellerPostalAddressDetails = new SellerPostalAddressDetails();

  parsableObject() {
    return {
      SellerOrganisationName: this.sellerOrganisationName,
      SellerOrganisationTaxCode: this.sellerOrganisationTaxCode,
      SellerPartyIdentifier: this.sellerPartyIdentifier,
      SellerPostalAddressDetails: this.sellerPostalAddressDetails.parsableObject()
    };
  }
}

class SellerPostalAddressDetails {
  sellerPostCodeIdentifier: number;
  sellerStreetName: string;
  sellerTownName: string;
  countryCode: string;

  parsableObject() {
    return {
      SellerPostCodeIdentifier: this.sellerPostCodeIdentifier,
      SellerStreetName: this.sellerStreetName,
      SellerTownName: this.sellerTownName,
      CountryCode: this.countryCode
    };
  }
}
