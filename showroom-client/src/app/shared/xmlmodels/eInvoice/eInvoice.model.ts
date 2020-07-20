import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {InvoiceDetailsModel} from './invoice-details.model';
import {InvoiceRowModel} from './invoice-row.model';
import {EpiDetailsModel} from './epi-details.model';
import {PurchaseDescription} from '../../sandbox.service';
import {Product, Store} from '../../store.model';

export class Finvoice {
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

  generate(purchase: PurchaseDescription, product: Product, seller: Store, paymentReference: string) {
    this.InvoiceDetails.generate(purchase, product, seller.currency);
    this.InvoiceRow.generate(product, purchase, seller.currency);
    this.EpiDetails.generate(product, purchase, seller, paymentReference);
  }
}


