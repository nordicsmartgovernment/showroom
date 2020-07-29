import {Component, OnDestroy, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {InventoryProduct, InventoryService} from '../../../shared/inventory.service';
import {Company, CompanyService} from '../../../shared/company.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sold',
  templateUrl: './sold.component.html',
  styleUrls: ['./sold.component.css']
})
export class SoldComponent implements OnInit, OnDestroy {

  inventory: InventoryProduct[];
  subscription;
  SALE_FILTER_KEY = 'saleFilter';
  private actingCompany: Company;
  private saleFilter: string[] = [];

  constructor(private sandboxService: SandboxService,
              private router: Router,
              private route: ActivatedRoute,
              private inventoryService: InventoryService,
              private companyService: CompanyService) {
  }

  ngOnInit(): void {
    const loadedPurchaseFilter = localStorage.getItem(this.SALE_FILTER_KEY);
    if (loadedPurchaseFilter) {
      this.saleFilter = JSON.parse(loadedPurchaseFilter);
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

  removeProduct(product: InventoryProduct) {
    this.addToSaleToFilter(product);
    this.inventoryService.removeFromInventory(product);
    this.inventory = this.filterSales(this.inventory);
  }

  private addToSaleToFilter(product: InventoryProduct) {
    if (!this.saleFilter.includes(this.actingCompany.id + product.invoiceId)) {
      this.saleFilter.push(this.actingCompany.id + product.invoiceId);
    }
    localStorage.setItem(this.SALE_FILTER_KEY, JSON.stringify(this.saleFilter));
  }

  private updatePurchases() {
    this.sandboxService.getSalesForActingCompany()
      .then(inventoryProducts => {
        this.inventory = this.filterSales(inventoryProducts);
      });
  }

  private filterSales(inventoryProducts: InventoryProduct[]): InventoryProduct[] {
    return inventoryProducts
      .filter(product => !this.saleFilter.includes(this.actingCompany.id + product.invoiceId));
  }

  navigateBack() {
    this.router.navigate(['/warehouse']);
  }
}
