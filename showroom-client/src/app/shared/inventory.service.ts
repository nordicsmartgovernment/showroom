import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AppXmlDate} from './xmlmodels/common-types';
import {CompanyService} from './company.service';
import {InventoryProduct} from './inventory.model';

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

  removeFromInventory(product: InventoryProduct) {
    const existingProduct = this.inventoryArray.filter(el => el.name === product.name);

    // merge with existing inventory item.
    if (existingProduct.length === 1) {
      const inventoryProduct = existingProduct[0];
      // remove the item if the amount is reduced to zero or below
      if (inventoryProduct.amount - product.amount <= 0) {
        const newInventory = [];
        newInventory.push(this.inventoryArray.filter(el => el.name === inventoryProduct.name));
        this.inventoryArray = newInventory;
      }

      inventoryProduct.price -= product.price;
      inventoryProduct.amount -= product.amount;
      this.pushInventoryChangedEvent();
    }
  }

  pushInventoryChangedEvent() {
    this.inventoryChanged.next(this.inventoryArray);
    this.companyService.saveCompanies();
  }
}
