import {CurrencyAmount, Quantity} from '../common-types';

export class InvoiceRowModel {
  articleGroupIdentifier: number;
  articleIdentifier: number;
  articleName: string;
  deliveredQuantity = new Quantity();
  eanCode: number;
  orderedQuantity = new Quantity();
  rowAmount = new CurrencyAmount();
  rowVatAmount = new CurrencyAmount();
  rowVatCode: string;
  rowVatExcludedAmount = new CurrencyAmount();
  rowVatRatePercent: string;
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
