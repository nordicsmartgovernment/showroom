import {CurrencyAmount, Quantity} from '../common-types';
import {PurchaseDescription} from '../../sandbox.service';
import {Product} from '../../store.model';

export class InvoiceRowModel {
  ArticleIdentifier: string;
  ArticleGroupIdentifier: string;
  ArticleName: string;
  EanCode: string;
  DeliveredQuantity = new Quantity();
  OrderedQuantity = new Quantity();
  UnitPriceAmount = new CurrencyAmount();
  RowVatRatePercent: number;
  RowVatCode: string;
  RowAmount = new CurrencyAmount();
  RowVatExcludedAmount = new CurrencyAmount();
  RowVatAmount = new CurrencyAmount();

  generate(product: Product, purchase: PurchaseDescription, currency: string) {
    this.ArticleGroupIdentifier = product.sellerItemID;
    this.ArticleIdentifier = product.commodityCode;
    this.ArticleName = product.itemName;
    this.EanCode = product.standardItemID;
    this.DeliveredQuantity.quantity = purchase.amount;
    this.DeliveredQuantity.quantityUnitCode = product.quantityCode;
    this.OrderedQuantity.quantity = purchase.amount;
    this.OrderedQuantity.quantityUnitCode = product.quantityCode;
    this.UnitPriceAmount.set(product.price, currency);
    this.RowVatRatePercent = product.vatRate;
    this.RowVatCode = 'S';
    this.RowVatAmount.set(purchase.vatPrice, currency);
    this.RowVatExcludedAmount.set(purchase.totalPriceExclVat, currency);
    this.RowAmount.set(purchase.totalPriceInclVat, currency);
  }
}
