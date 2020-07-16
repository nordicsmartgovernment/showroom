import {BuyerPartyDetailsModel, SellerPartyDetailsModel} from '../details.model';
import {InvoiceDetailsModel} from './invoice-details.model';
import {InvoiceRowModel} from './invoice-row.model';
import {EpiDetailsModel} from './epi-details.model';

export class EInvoiceModel {
  buyerPartyDetailsModel = new BuyerPartyDetailsModel();
  sellerPartyDetailsModel = new SellerPartyDetailsModel();
  invoiceDetails = new InvoiceDetailsModel();
  invoiceRow = new InvoiceRowModel();
  epiDetails = new EpiDetailsModel();

  parsableObject() {
    return {
      Finvoice: {
        __Version: 2,
        BuyerPartyDetails: this.buyerPartyDetailsModel.parsableObject(),
        SellerPartyDetails: this.sellerPartyDetailsModel.parsableObject(),
        InvoiceDetails: this.invoiceDetails.parsableObject(),
        InvoiceRow: this.invoiceRow.parsableObject(),
        EpiDetails: this.epiDetails.parsableObject()
      }
    };
  }
}


