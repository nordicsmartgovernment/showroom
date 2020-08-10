import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {InvoiceDetailsModel} from './invoice-details.model';
import {EpiDetailsModel} from '../epi-details.model';
import {PurchaseDescription} from '../../sandbox.service';
import {Product, Store} from '../../store.model';
import {InvoiceRowModel} from '../Invoice-row.model';
import {Company} from '../../company.service';

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
           seller: Store,
           paymentReference: string,
           invoiceId: string,
           buyer: Company) {
    this.InvoiceDetails.generate(purchase, product, seller.currency, invoiceId);
    this.InvoiceRow.generate(product, purchase, seller.currency);
    this.EpiDetails.generate(purchase, seller, paymentReference);
    this.BuyerPartyDetails = new BuyerPartyDetailsModel(buyer);
    this.SellerPartyDetails = new SellerPartyDetailsModel(seller);
  }
}


