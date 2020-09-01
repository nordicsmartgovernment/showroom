import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';
import {InvoiceDetailsReceiptModel} from './invoice-details-receipt.model';
import {InvoiceRowModel} from '../Invoice-row.model';
import {EpiDetailsModel} from '../epi-details.model';
import {Company} from '../../company.service';
import {MessageDetailsModel} from './message-details.model';
import {vatDetailsBetweenTwoCountries} from '../../utils/vatUtil';

export class EReceipt {
  Finvoice = new EReceiptModel();
}

export class EReceiptModel {
  // tslint:disable-next-line:variable-name
  __Version = 2;
  MessageTransmissionDetails = new MessageDetailsModel();
  SellerPartyDetails = new SellerPartyDetailsModel();
  BuyerPartyDetails = new BuyerPartyDetailsModel();
  InvoiceDetails = new InvoiceDetailsReceiptModel();
  PaymentStatusDetails = new PaymentStatusDetails();
  InvoiceRow: InvoiceRowModel[] = [];
  EpiDetails = new EpiDetailsModel();


  generate(purchase: PurchaseDescription,
           product: Product,
           seller: Company,
           paymentReference: string,
           invoiceId: string,
           buyer: Company, sellerCurrency: string) {
    const vatCode = vatDetailsBetweenTwoCountries(buyer.country, seller.country).vatCode;
    this.MessageTransmissionDetails.generate(seller.id);
    this.PaymentStatusDetails.PaymentStatusCode = 'PAID';
    this.InvoiceDetails.generate(purchase, product, sellerCurrency, invoiceId);
    this.EpiDetails.generate(purchase, seller, paymentReference, sellerCurrency);
    this.EpiDetails.EpiIdentificationDetails.EpiDate.setToCurrentDate();
    this.BuyerPartyDetails = new BuyerPartyDetailsModel(buyer);
    this.SellerPartyDetails = new SellerPartyDetailsModel(seller);
    const invoiceRow = new InvoiceRowModel();
    invoiceRow.generate(product, purchase, sellerCurrency, vatCode);
    const invoiceSubRow = new InvoiceRowModel();
    invoiceSubRow.generateSubInvoiceRow(purchase, sellerCurrency);
    this.InvoiceRow.push(
      invoiceRow,
      invoiceSubRow,
    );
  }
}

class PaymentStatusDetails {
  PaymentStatusCode = '';
}
