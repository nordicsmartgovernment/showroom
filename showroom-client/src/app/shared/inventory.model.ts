import {formatDate} from '@angular/common';

export class InventoryProduct {
  name: string;
  amount: number;
  price: number;
  currency: string;
  date: string;
  amountUnit: string;
  invoiceId: string;

  constructor(
    name: string,
    amount: number,
    amountUnit: string,
    price: number,
    currency: string,
    date: number,
  ) {
    this.currency = currency;
    this.price = price;
    this.amount = amount;
    this.amountUnit = amountUnit;
    this.name = name;
    const dateString = date.toString();
    const newDate = new Date(
      +dateString.substr(0, 4),
      +dateString.substr(4, 2),
      +dateString.substr(6, 2));
    this.date = formatDate(newDate, 'yyyy-MM-dd', 'en-en');
  }

  setInvoiceId(invoiceId: string) {
    this.invoiceId = invoiceId;
  }
}
