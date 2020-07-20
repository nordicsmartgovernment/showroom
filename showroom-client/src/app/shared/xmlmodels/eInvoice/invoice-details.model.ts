/* INVOICE DETAILS START */
import {AppXmlDate, CurrencyAmount} from '../common-types';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';

export class InvoiceDetailsModel {

  accountDimensionText: string;
  invoiceDate = new AppXmlDate();
  invoiceNumber: number;
  invoiceTotalVatExcludedAmount = new CurrencyAmount();
  invoiceTotalVatIncludedAmount = new CurrencyAmount();
  invoiceTypeCode: string;
  invoiceTypeText: string;
  originCode: string;
  paymentTermsDetails = new PaymentTermsDetails();
  vatSpecificationDetails = new VatSpecificationDetails();

  parsableObject() {
    return {
      InvoiceTypeCode: this.invoiceTypeCode,
      InvoiceTypeText: this.invoiceTypeText,
      OriginCode: this.originCode,
      InvoiceNumber: this.invoiceNumber,
      InvoiceDate: this.invoiceDate.parsableObject(),
      InvoiceTotalVatExcludedAmount: this.invoiceTotalVatExcludedAmount.parsableObject(),
      InvoiceTotalVatIncludedAmount: this.invoiceTotalVatIncludedAmount.parsableObject(),
      AccountDimensionText: this.accountDimensionText,
      VatSpecificationDetails: this.vatSpecificationDetails.parsableObject(),
      PaymentTermsDetails: this.paymentTermsDetails.parsableObject(),
    };
  }

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.invoiceTypeCode = 'INV01';
    this.invoiceTypeText = 'INVOICE';
    this.originCode = 'Original';
    this.invoiceNumber = Math.ceil(Math.random() * 10000);
    this.invoiceDate.setToCurrentDate();
    this.invoiceTotalVatExcludedAmount.amount = purchase.totalPriceExclVat;
    this.invoiceTotalVatExcludedAmount.currencyIdentifier = currency;
    this.invoiceTotalVatIncludedAmount.amount = purchase.totalPriceInclVat;
    this.invoiceTotalVatIncludedAmount.currencyIdentifier = currency;
    // TODO generate:
    // static, for now. $accountID This is the accounting reference and we can use static ones for all purchases but
    // we still need to take the country of the buyer into account, perhaps some small mapping table will help.
    this.accountDimensionText = '2490';
    this.vatSpecificationDetails.generate(purchase, product, currency);
    this.paymentTermsDetails.generate();
  }
}

class PaymentTermsDetails {
  invoiceDueDate = new AppXmlDate();
  private paymentOverDueFineDetails = new PaymentOverDueFineDetails();
  private paymentTermsFreeText: string;


  parsableObject() {
    return {
      InvoiceDueDate: this.invoiceDueDate.parsableObject(),
      PaymentOverDueFineDetails: this.paymentOverDueFineDetails.parsableObject(),
      PaymentTermsFreeText: this.paymentTermsFreeText,
    };
  }

  generate() {
    this.paymentTermsFreeText = '14 days net';
    this.invoiceDueDate.setToRelativeDaysFromCurrent(14);
    this.paymentOverDueFineDetails.paymentOverDueFineFreeText = '1,5 %';
    this.paymentOverDueFineDetails.paymentOverDueFinePercent = '1,5';
  }
}

class PaymentOverDueFineDetails {
  paymentOverDueFineFreeText: string;
  paymentOverDueFinePercent: string;

  parsableObject() {
    return {
      PaymentOverDueFineFreeText: this.paymentOverDueFineFreeText,
      PaymentOverDueFinePercent: this.paymentOverDueFinePercent
    };
  }
}

class VatSpecificationDetails {
  vatBaseAmount = new CurrencyAmount();
  vatRateAmount = new CurrencyAmount();
  private vatCode: string;
  private vatRatePercent: string;

  parsableObject() {
    return {
      vatBaseAmount: this.vatBaseAmount.parsableObject(),
      vatCode: this.vatCode,
      vatRateAmount: this.vatRateAmount.parsableObject(),
      vatRatePercent: this.vatRatePercent,
    };
  }

  generate(purchase: PurchaseDescription, product: Product, currency: string) {
    this.vatBaseAmount.amount = purchase.totalPriceExclVat;
    this.vatBaseAmount.currencyIdentifier = currency;
    this.vatRatePercent = `${product.vatRate},00`;
    this.vatCode = 'S';
    this.vatRateAmount.amount = purchase.vatPrice;
    this.vatRateAmount.currencyIdentifier = currency;
  }
}
