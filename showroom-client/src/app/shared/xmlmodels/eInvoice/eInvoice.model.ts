import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {InvoiceDetailsModel} from './invoice-details.model';
import {EpiDetailsModel} from '../epi-details.model';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';
import {InvoiceRowModel} from '../Invoice-row.model';
import {Company} from '../../company.service';
import {vatDetailsBetweenTwoCountries} from '../../utils/vatUtil';

export class EInvoice {
  Finvoice = new EInvoiceModel();
}

export class EInvoiceModel {
  // tslint:disable-next-line:variable-name
  __Version = 2;
  SellerPartyDetails = new SellerPartyDetailsModel();
  BuyerPartyDetails = new BuyerPartyDetailsModel();
  InvoiceDetails = new InvoiceDetailsModel();
  InvoiceRow = new InvoiceRowModel();
  EpiDetails = new EpiDetailsModel();

  generate(purchase: PurchaseDescription,
           product: Product,
           seller: Company,
           paymentReference: string,
           invoiceId: string,
           buyer: Company,
           sellerCurrency: string) {
    const vatCode = vatDetailsBetweenTwoCountries(buyer.country, seller.country).vatCode;
    this.InvoiceDetails.generate(purchase, product, sellerCurrency, invoiceId);
    this.InvoiceRow.generate(product, purchase, sellerCurrency, vatCode);
    this.EpiDetails.generate(purchase, seller, paymentReference, sellerCurrency);
    this.BuyerPartyDetails = new BuyerPartyDetailsModel(buyer);
    this.SellerPartyDetails = new SellerPartyDetailsModel(seller);
  }
}


