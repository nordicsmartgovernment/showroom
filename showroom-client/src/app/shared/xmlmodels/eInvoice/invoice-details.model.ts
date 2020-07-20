/* INVOICE DETAILS START */
import {AppXmlDate, CurrencyAmount} from '../common-types';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';

export class InvoiceDetailsModel {

  InvoiceTypeCode: string;
  InvoiceTypeText: string;
  OriginCode: string;
  InvoiceNumber: number;
  InvoiceDate = new AppXmlDate();
  InvoiceTotalVatExcludedAmount = new CurrencyAmount();
  InvoiceTotalVatIncludedAmount = new CurrencyAmount();
  AccountDimensionText: string;
  VatSpecificationDetails = new VatSpecificationDetails();
  PaymentTermsDetails = new PaymentTermsDetails();

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.InvoiceTypeCode = 'INV01';
    this.InvoiceTypeText = 'INVOICE';
    this.OriginCode = 'Original';
    this.InvoiceNumber = Math.ceil(Math.random() * 10000);
    this.InvoiceDate.setToCurrentDate();
    this.InvoiceTotalVatExcludedAmount.set(purchase.totalPriceExclVat, currency);
    this.InvoiceTotalVatIncludedAmount.set(purchase.totalPriceInclVat, currency);
    // TODO generate:
    // static, for now. $accountID This is the accounting reference and we can use static ones for all purchases but
    // we still need to take the country of the buyer into account, perhaps some small mapping table will help.
    this.AccountDimensionText = '2490';
    this.VatSpecificationDetails.generate(purchase, product, currency);
    this.PaymentTermsDetails.generate();
  }
}

class PaymentTermsDetails {
  PaymentTermsFreeText: string;
  InvoiceDueDate = new AppXmlDate();
  PaymentOverDueFineDetails = new PaymentOverDueFineDetails();

  generate() {
    this.PaymentTermsFreeText = '14 days net';
    this.InvoiceDueDate.setToRelativeDaysFromCurrent(14);
    this.PaymentOverDueFineDetails.PaymentOverDueFineFreeText = '1,5 %';
    this.PaymentOverDueFineDetails.PaymentOverDueFinePercent = '1,5';
  }
}

class PaymentOverDueFineDetails {
  PaymentOverDueFineFreeText: string;
  PaymentOverDueFinePercent: string;
}

class VatSpecificationDetails {
  VatBaseAmount = new CurrencyAmount();
  VatRatePercent: string;
  VatCode: string;
  VatRateAmount = new CurrencyAmount();

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.VatBaseAmount.set(purchase.totalPriceExclVat, currency);
    this.VatRatePercent = `${product.vatRate},00`;
    this.VatCode = 'S';
    this.VatRateAmount.set(purchase.vatPrice, currency);
  }
}
