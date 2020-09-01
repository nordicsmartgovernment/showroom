import {Component, OnDestroy, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {InventoryService} from '../../../shared/inventory.service';
import {Company, CompanyService} from '../../../shared/company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryProduct} from '../../../shared/inventory.model';
import {CurrencyService} from '../../../shared/currency.service';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.css']
})
export class PurchasedComponent implements OnInit, OnDestroy {

  inventory: InventoryProduct[];
  subscription;
  PURCHASE_FILTER_KEY = 'purchaseFilter';
  private actingCompany: Company;
  private purchaseFilter: string[] = [];

  constructor(private sandboxService: SandboxService,
              private router: Router,
              private currencyService: CurrencyService,
              private route: ActivatedRoute,
              private inventoryService: InventoryService,
              private companyService: CompanyService) {
  }

  ngOnInit(): void {
    const loadedPurchaseFilter = localStorage.getItem(this.PURCHASE_FILTER_KEY);
    if (loadedPurchaseFilter) {
      this.purchaseFilter = JSON.parse(loadedPurchaseFilter);
      console.log('asd' + loadedPurchaseFilter);
    }
    this.updatePurchases();
    this.actingCompany = this.companyService.getActingCompany();
    this.subscription = this.companyService.actingCompanyChanged.subscribe(actingCompany => {
      this.actingCompany = actingCompany;
      this.updatePurchases();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addProduct(product: InventoryProduct) {
    this.addToPurchaseFilter(product);
    this.inventoryService.addToInventory(product);
    this.inventory = this.filterPurchases(this.inventory);
  }

  private addToPurchaseFilter(product: InventoryProduct) {
    if (!this.purchaseFilter.includes(this.actingCompany.id + product.invoiceId)) {
      this.purchaseFilter.push(this.actingCompany.id + product.invoiceId);
    }
    localStorage.setItem(this.PURCHASE_FILTER_KEY, JSON.stringify(this.purchaseFilter));
  }

  private updatePurchases() {
    this.sandboxService.getPurchaseItemsForActingCompany()
      .then(inventoryProducts => {
        this.inventory = this.filterPurchases(inventoryProducts);
      });
  }

  private filterPurchases(inventoryProducts: InventoryProduct[]): InventoryProduct[] {
    return inventoryProducts
      .filter(product => !this.purchaseFilter.includes(this.actingCompany.id + product.invoiceId));
  }

  navigateBack() {
    this.router.navigate(['/warehouse']);
  }


  convertToCompanyCurrency(i: InventoryProduct): number {
    return this.currencyService.convertToActingCompanyCurrency(i.price, i.currency);
  }

  companyCurrency(): string {
    return this.currencyService.getActingCompanyCurrency();
  }
}
