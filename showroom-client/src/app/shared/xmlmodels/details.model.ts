import {Company} from '../company.service';

// TODO consider consolidating buyer and seller, and just return two different parsable xml objects
export class BuyerPartyDetailsModel {
  buyerOrganisationName: string;
  buyerOrganisationTaxCode: string;
  buyerPartyIdentifier: string;
  buyerPostalAddressDetails = new BuyerPostalAddressDetails();

  constructor(private buyer?: Company) {
    if (!buyer) {
      return;
    }
    this.buyerOrganisationName = this.buyer.name;
    this.buyerOrganisationTaxCode = this.buyer.vatId;
    this.buyerPartyIdentifier = '' + this.buyer.id;
    this.buyerPostalAddressDetails.countryCode = this.buyer.country;
    this.buyerPostalAddressDetails.buyerPostCodeIdentifier = this.buyer.postCodeIdentifier;
    this.buyerPostalAddressDetails.buyerStreetName = this.buyer.streetName;
    this.buyerPostalAddressDetails.buyerTownName = this.buyer.townName;
  }

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
  buyerPostCodeIdentifier: string;
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

  constructor(private seller?: Company) {
    if (!seller) {
      return;
    }
    this.sellerOrganisationName = this.seller.name;
    this.sellerOrganisationTaxCode = this.seller.vatId;
    this.sellerPartyIdentifier = '' + this.seller.id;
    this.sellerPostalAddressDetails.countryCode = this.seller.country;
    this.sellerPostalAddressDetails.sellerPostCodeIdentifier = this.seller.postCodeIdentifier;
    this.sellerPostalAddressDetails.sellerStreetName = this.seller.streetName;
    this.sellerPostalAddressDetails.sellerTownName = this.seller.townName;
  }

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
  sellerPostCodeIdentifier: string;
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

