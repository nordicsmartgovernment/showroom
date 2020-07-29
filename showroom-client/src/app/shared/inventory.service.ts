import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AppXmlDate} from './xmlmodels/common-types';
import {formatDate} from '@angular/common';
import {CompanyService} from './company.service';

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

@Injectable({providedIn: 'root'})
export class InventoryService {
  inventoryChanged = new Subject<InventoryProduct[]>();
  private inventoryArray: InventoryProduct[] = [];

  constructor(private companyService: CompanyService) {
    this.inventoryArray = this.companyService.getActingCompany().inventory;
    this.companyService.actingCompanyChanged.subscribe(company => {
      this.inventoryArray = company.inventory;
      this.pushInventoryChangedEvent();
    });
    const date = new AppXmlDate();
    date.setToCurrentDate();
  }

  get inventory(): InventoryProduct[] {
    return this.inventoryArray;
  }

  addToInventory(product: InventoryProduct) {
    const existingProduct = this.inventoryArray.filter(el => el.name === product.name);

    // merge with existing inventory item.
    if (existingProduct.length === 1) {
      const inventoryProduct = existingProduct[0];
      inventoryProduct.price += product.price;
      inventoryProduct.amount += product.amount;
    } else {
      // push new unique product
      this.inventoryArray.push(Object.assign({}, product));
    }
    this.pushInventoryChangedEvent();
  }

  private pushInventoryChangedEvent() {
    this.inventoryChanged.next(this.inventoryArray);
    this.companyService.saveCompanies();
  }
}
