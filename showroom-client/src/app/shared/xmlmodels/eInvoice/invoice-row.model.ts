import {CurrencyAmount, Quantity} from '../common-types';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';

export class InvoiceRowModel {
  articleGroupIdentifier: string;
  articleIdentifier: string;
  articleName: string;
  deliveredQuantity = new Quantity();
  eanCode: string;
  orderedQuantity = new Quantity();
  rowAmount = new CurrencyAmount();
  rowVatAmount = new CurrencyAmount();
  rowVatCode: string;
  rowVatExcludedAmount = new CurrencyAmount();
  rowVatRatePercent: number;
  unitPriceAmount = new CurrencyAmount();

  parsableObject() {
    return {
      ArticleGroupIdentifier: this.articleGroupIdentifier,
      ArticleIdentifier: this.articleIdentifier,
      ArticleName: this.articleName,
      DeliveredQuantity: this.deliveredQuantity.parsableObject(),
      EanCode: this.eanCode,
      OrderedQuantity: this.orderedQuantity.parsableObject(),
      RowAmount: this.rowAmount.parsableObject(),
      RowVatAmount: this.rowVatAmount.parsableObject(),
      RowVatCode: this.rowVatCode,
      RowVatExcludedAmount: this.rowVatExcludedAmount.parsableObject(),
      RowVatRatePercent: this.rowVatRatePercent,
      UnitPriceAmount: this.unitPriceAmount.parsableObject(),
    };
  }

  generate(product: Product, purchase: PurchaseDescription, currency: string) {
    this.articleGroupIdentifier = product.sellerItemID;
    this.articleIdentifier = product.commodityCode;
    this.articleName = product.itemName;
    this.eanCode = product.standardItemID;
    this.deliveredQuantity.quantity = purchase.amount;
    this.deliveredQuantity.quantityUnitCode = product.quantityCode;
    this.orderedQuantity.quantity = purchase.amount;
    this.orderedQuantity.quantityUnitCode = product.quantityCode;
    this.unitPriceAmount.currencyIdentifier = currency;
    this.unitPriceAmount.amount = product.price;
    this.rowVatRatePercent = product.vatRate;
    this.rowVatCode = 'S';
    this.rowVatAmount.currencyIdentifier = currency;
    this.rowVatAmount.amount = purchase.vatPrice;
    this.rowVatExcludedAmount.currencyIdentifier = currency;
    this.rowVatExcludedAmount.amount = purchase.totalPriceExclVat;
    this.rowAmount.currencyIdentifier = currency;
    this.rowAmount.amount = purchase.totalPriceInclVat;
  }
}

/*
ArticleGroupIdentifier: 50101634
ArticleIdentifier: 8085250
ArticleName: "Oranges"
DeliveredQuantity: {_text_: 15, __QuantityUnitCode: "KG"}
EanCode: 83111500
OrderedQuantity: {_text_: 15, __QuantityUnitCode: "KG"}
RowAmount: {_text_: "46,88", __AmountCurrencyIdentifier: "DKK"}
RowVatAmount: {_text_: "9,38", __AmountCurrencyIdentifier: "DKK"}
RowVatCode: "S"
RowVatExcludedAmount: {_text_: "37,50", __AmountCurrencyIdentifier: "DKK"}
RowVatRatePercent: "25,00"
UnitPriceAmount: {_text_: "2,5", __AmountCurrencyIdentifier: "DKK"}
* */
