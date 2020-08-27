import {CurrencyAmount, Quantity} from './common-types';
import {Product} from '../store.model';
import {PurchaseDescription} from '../sandbox.service';

export class InvoiceRowModel {
  ArticleIdentifier: string;
  ArticleGroupIdentifier: string;
  ArticleName: string;
  EanCode: string;
  DeliveredQuantity: Quantity;
  OrderedQuantity: Quantity;
  UnitPriceAmount: CurrencyAmount;
  RowVatRatePercent: number;
  RowVatCode: string;
  RowAmount: CurrencyAmount;
  RowVatExcludedAmount: CurrencyAmount;
  RowVatAmount: CurrencyAmount;
  SubInvoiceRow: SubInvoiceRow;

  generate(product: Product, purchase: PurchaseDescription, currency: string, vatCode: string) {
    // All fields are set in the correct order. Right now this is the only way to order the fields in the xml.
    this.ArticleIdentifier = '';
    this.ArticleGroupIdentifier = '';
    this.ArticleName = '';
    this.EanCode = '';
    this.DeliveredQuantity = new Quantity();
    this.OrderedQuantity = new Quantity();
    this.UnitPriceAmount = new CurrencyAmount();
    this.RowVatRatePercent = 0;
    this.RowVatCode = '';
    this.RowVatAmount = new CurrencyAmount();
    this.RowVatExcludedAmount = new CurrencyAmount();
    this.RowAmount = new CurrencyAmount();
    this.ArticleGroupIdentifier = product.sellerItemID;
    this.ArticleIdentifier = product.commodityCode;
    this.ArticleName = product.itemName;
    this.EanCode = product.standardItemID;
    this.DeliveredQuantity._text_ = purchase.amount;
    this.DeliveredQuantity.__QuantityUnitCode = product.quantityCode;
    this.OrderedQuantity._text_ = purchase.amount;
    this.OrderedQuantity.__QuantityUnitCode = product.quantityCode;
    this.UnitPriceAmount.set(product.price, currency);
    this.RowVatRatePercent = product.vatRate;
    this.RowVatCode = vatCode;
    this.RowVatAmount.set(purchase.vatPrice, currency);
    this.RowVatExcludedAmount.set(purchase.totalPriceExclVat, currency);
    this.RowAmount.set(purchase.totalPriceInclVat, currency);
  }

  generateSubInvoiceRow(purchase: PurchaseDescription, currency: string) {
    this.SubInvoiceRow = new SubInvoiceRow();

    this.SubInvoiceRow.generate(currency, purchase.totalPriceInclVat);
  }
}


class SubInvoiceRow {
  SubIdentifier = '';
  SubArticleIdentifier = '';
  SubArticleName = '';
  SubRowDefinitionDetails: SubRowDefinitionDetail[] = [];
  SubRowAmount = new CurrencyAmount();

  generate(currency: string, priceIncludingVat: number) {
    this.SubIdentifier = 'PAYMENT';
    this.SubArticleIdentifier = 'Kortti';
    this.SubArticleName = 'MAKSUTAPA';
    this.SubRowDefinitionDetails = [
      new SubRowDefinitionDetail('CARD00000', 'CardMaskedNumber', '524342xxxxxx1401'),
      new SubRowDefinitionDetail('CARD00001', 'ReferenceNumber', '151222010038'),
      new SubRowDefinitionDetail('CARD00002', 'TimeStamp', '151222100715'),
      new SubRowDefinitionDetail('CARD00003', 'RequestedAmount', '755,90'),
      new SubRowDefinitionDetail('CARD00004', 'AuthorizationCode'),
      new SubRowDefinitionDetail('CARD00005', 'MerchantNumber'),
      new SubRowDefinitionDetail('CARD00006', 'AuthorizingTermID'),
      new SubRowDefinitionDetail('CARD00007', 'VerifiedByPINFlag'),
      new SubRowDefinitionDetail('CARD00008', 'TenderAuthorizationMethodType', 'ChipPin'),
      new SubRowDefinitionDetail('CARD00009', 'CreditCardCompanyCode', 'L5'),
    ];
    this.SubRowAmount.set(priceIncludingVat, currency);
  }
}

class SubRowDefinitionDetail {
  SubRowDefinitionHeaderText: SubRowDefinitionHeaderText;
  SubRowDefinitionValue: string;

  constructor(definitionCode: string, subRowDefinitionHeaderText: string, subRowDefinitionValue?: string) {
    this.SubRowDefinitionHeaderText = new SubRowDefinitionHeaderText(definitionCode, subRowDefinitionHeaderText);
    this.SubRowDefinitionValue = subRowDefinitionValue;
  }
}

class SubRowDefinitionHeaderText {
  // tslint:disable-next-line:variable-name
  __DefinitionCode = '';
  // tslint:disable-next-line:variable-name
  _text_ = '';

  constructor(definitionCode: string, subRowDefinitionHeaderText: string) {
    this.__DefinitionCode = definitionCode;
    this._text_ = subRowDefinitionHeaderText;
  }

}
