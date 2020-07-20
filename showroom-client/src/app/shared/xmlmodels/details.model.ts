import {Company} from '../company.service';

export class BuyerPartyDetailsModel {
  BuyerPartyIdentifier: string;
  BuyerOrganisationName: string;
  BuyerOrganisationTaxCode: string;
  BuyerPostalAddressDetails = new BuyerPostalAddressDetails();

  constructor(buyer?: Company) {
    if (!buyer) {
      return;
    }
    this.BuyerOrganisationName = buyer.name;
    this.BuyerOrganisationTaxCode = buyer.vatId;
    this.BuyerPartyIdentifier = '' + buyer.id;
    this.BuyerPostalAddressDetails.CountryCode = buyer.country;
    this.BuyerPostalAddressDetails.BuyerPostCodeIdentifier = buyer.postCodeIdentifier;
    this.BuyerPostalAddressDetails.BuyerStreetName = buyer.streetName;
    this.BuyerPostalAddressDetails.BuyerTownName = buyer.townName;
  }
}

class BuyerPostalAddressDetails {
  BuyerStreetName: string;
  BuyerTownName: string;
  BuyerPostCodeIdentifier: string;
  CountryCode: string;
}

export class SellerPartyDetailsModel {
  SellerPartyIdentifier: string;
  SellerOrganisationName: string;
  SellerOrganisationTaxCode: string;
  SellerPostalAddressDetails = new SellerPostalAddressDetails();

  constructor(seller?: Company) {
    if (!seller) {
      return;
    }
    this.SellerOrganisationName = seller.name;
    this.SellerOrganisationTaxCode = seller.vatId;
    this.SellerPartyIdentifier = '' + seller.id;
    this.SellerPostalAddressDetails.CountryCode = seller.country;
    this.SellerPostalAddressDetails.SellerPostCodeIdentifier = seller.postCodeIdentifier;
    this.SellerPostalAddressDetails.SellerStreetName = seller.streetName;
    this.SellerPostalAddressDetails.SellerTownName = seller.townName;
  }
}

class SellerPostalAddressDetails {
  SellerStreetName: string;
  SellerTownName: string;
  SellerPostCodeIdentifier: string;
  CountryCode: string;
}

