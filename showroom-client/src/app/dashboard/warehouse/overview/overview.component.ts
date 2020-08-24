import {Component, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryService} from '../../../shared/inventory.service';
import {InventoryProduct} from '../../../shared/inventory.model';
import {CurrencyService} from '../../../shared/currency.service';
import {CompanyService} from '../../../shared/company.service';
import {Order} from '../../ordering/order.component';
import {StoreService} from '../../../shared/store.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  inventory: InventoryProduct[];

  constructor(private sandboxService: SandboxService,
              private router: Router,
              private currencyService: CurrencyService,
              private companyService: CompanyService,
              private storeService: StoreService,
              private inventoryService: InventoryService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.inventory = this.inventoryService.inventory;
    this.inventoryService.inventoryChanged
      .subscribe(change => {
        this.inventory = change;
      });
  }

  navigateTo(page: string) {
    this.router.navigate([page], {relativeTo: this.route});
  }


  convertToCompanyCurrency(i: {price: number, currency: string}): number {
    return this.currencyService.convertToActingCompanyCurrency(i.price, i.currency);
  }

  companyCurrency(): string {
    return this.currencyService.getActingCompanyCurrency();
  }

  getPendingOrders(): { name: string, price: number, amount: number, amountUnit: string, currency: string }[] {
    const allOrders: Order[] = [];
    const actingCompany = this.companyService.getActingCompany().id;
    this.companyService.getAllCompanies().forEach(company => allOrders.push(...company.orders));
    const pendingOrders: { name: string, price: number, amount: number, amountUnit: string, currency: string }[] = [];
    allOrders.filter(order => order.buyer === actingCompany)
      .forEach(order =>
        order.orderLines.forEach(
          orderLine => {
            pendingOrders.push({
              currency: this.storeService.getStore(order.seller).currency,
              price: orderLine.product.price,
              amount: orderLine.amount,
              amountUnit: orderLine.product.quantityCode,
              name: orderLine.product.itemName,
            });
          }
        )
      );
    return pendingOrders;
  }
}
