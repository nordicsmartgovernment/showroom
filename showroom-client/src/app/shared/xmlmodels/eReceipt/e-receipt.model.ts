import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {PurchaseDescription} from '../../sandbox.service';
import {Product, Store} from '../../store.model';
import {InvoiceDetailsReceiptModel} from './invoice-details-receipt.model';
import {InvoiceRowModel} from '../Invoice-row.model';
import {EpiDetailsModel} from '../epi-details.model';
import {Company} from '../../company.service';

export class EReceipt {
  Finvoice = new EReceiptModel();
}

export class EReceiptModel {
  // tslint:disable-next-line:variable-name
  __Version = 2;
  SellerPartyDetails = new SellerPartyDetailsModel();
  BuyerPartyDetails = new BuyerPartyDetailsModel();
  InvoiceDetails = new InvoiceDetailsReceiptModel();
  PaymentStatusDetails = new PaymentStatusDetails();
  InvoiceRow: InvoiceRowModel[] = [];
  EpiDetails = new EpiDetailsModel();


  generate(purchase: PurchaseDescription,
           product: Product,
           seller: Store,
           paymentReference: string,
           invoiceId: string,
           buyer: Company) {
    this.PaymentStatusDetails.PaymentStatusCode = 'PAID';
    this.InvoiceDetails.generate(purchase, product, seller.currency, invoiceId);
    this.EpiDetails.generate(product, purchase, seller, paymentReference);
    this.EpiDetails.EpiIdentificationDetails.EpiDate.setToCurrentDate();
    this.BuyerPartyDetails = new BuyerPartyDetailsModel(buyer);
    this.SellerPartyDetails = new SellerPartyDetailsModel(seller);
    const invoiceRow = new InvoiceRowModel();
    invoiceRow.generate(product, purchase, seller.currency);
    const invoiceSubRow = new InvoiceRowModel();
    invoiceRow.generateSubInvoiceRow(purchase, seller.currency);
    this.InvoiceRow.push(
      invoiceRow,
      invoiceSubRow,
    );
  }
}

class PaymentStatusDetails {
  PaymentStatusCode: string;
}
