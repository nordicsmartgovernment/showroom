import {AppXmlDate, CurrencyAmount, VatSpecificationDetails} from '../common-types';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';

export class InvoiceDetailsReceiptModel {

  InvoiceTypeCode: string; //
  InvoiceTypeCodeUN: string; //
  InvoiceTypeText: string; //
  OriginCode: string; //
  InvoiceNumber: string; //
  InvoiceDate = new AppXmlDate(); //
  SellersBuyerIdentifier: string; //
  InvoiceTotalVatExcludedAmount = new CurrencyAmount();
  InvoiceTotalVatAmount = new CurrencyAmount();
  InvoiceTotalVatIncludedAmount = new CurrencyAmount();
  VatSpecificationDetails = new VatSpecificationDetails();

  generate(purchase: PurchaseDescription, product: Product, currency: string, invoiceId: string) {
    this.InvoiceTypeCode = 'REC01';
    this.InvoiceTypeCodeUN = '632';
    this.InvoiceTypeText = 'Electronic receipt';
    this.OriginCode = 'Original';
    this.InvoiceNumber = invoiceId;
    this.InvoiceDate.setToCurrentDate();
    this.SellersBuyerIdentifier = 'NA';
    this.InvoiceTotalVatExcludedAmount.set(purchase.totalPriceExclVat, currency);
    this.InvoiceTotalVatAmount.set(purchase.vatPrice, currency);
    this.InvoiceTotalVatIncludedAmount.set(purchase.totalPriceInclVat, currency);
    // TODO generate:
    // static, for now. $accountID This is the accounting reference and we can use static ones for all purchases but
    // we still need to take the country of the buyer into account, perhaps some small mapping table will help.
    this.VatSpecificationDetails.generate(purchase, product, currency);
  }
}

