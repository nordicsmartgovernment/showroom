/* INVOICE DETAILS START */
import {AppXmlDate, CurrencyAmount} from '../common-types';

export class InvoiceDetailsModel {

  accountDimensionText: number;
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
      AccountDimensionText: this.accountDimensionText,
      InvoiceDate: this.invoiceDate.parsableObject(),
      InvoiceNumber: this.invoiceNumber,
      InvoiceTotalVatExcludedAmount: this.invoiceTotalVatExcludedAmount.parsableObject(),
      InvoiceTotalVatIncludedAmount: this.invoiceTotalVatIncludedAmount.parsableObject(),
      InvoiceTypeCode: this.invoiceTypeCode,
      InvoiceTypeText: this.invoiceTypeText,
      OriginCode: this.originCode,
      PaymentTermsDetails: this.paymentTermsDetails.parsableObject(),
      VatSpecificationDetails: this.vatSpecificationDetails.parsableObject(),
    };
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
}
