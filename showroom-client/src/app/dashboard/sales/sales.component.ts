import {Component, OnInit} from '@angular/core';
import {Company, CompanyService} from '../../shared/company.service';
import {
  round,
  totalSumExclVAT,
  totalSumInclVAT
} from '../../shared/utils/vatUtil';
import {SandboxService} from '../../shared/sandbox.service';
import {StoreService} from '../../shared/store.service';
import {Router} from '@angular/router';
import {Store} from '../../shared/store.model';
import {Order, OrderLine} from '../ordering/order.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  readonly REVIEW_SALES_PAGE = 'reviewSales';
  readonly REVIEW_SALE_PAGE = 'reviewSale';
  activePage = this.REVIEW_SALES_PAGE;
  salesOrders: Order[];
  actingStore: Store;
  selectedOrder: Order;
  private selectedOrderNumber: number;
  private actingCompany: Company;

  constructor(private companyService: CompanyService,
              private router: Router,
              private storeService: StoreService,
              private sandboxService: SandboxService) {
  }

  ngOnInit(): void {
    this.onCompanyChanged(this.companyService.getActingCompany());
    this.salesOrders = this.actingCompany.orders;

    this.companyService.actingCompanyChanged.subscribe(
      company => {
        this.onCompanyChanged(company);
      }
    );
  }

  onRejectOrder(index: number) {
    this.salesOrders.splice(index, 1);
    this.companyService.saveCompanies();
  }

  getBuyer(buyer: number): Company {
    return this.companyService.getCompany(buyer);
  }

  onReviewOrder(index: number) {
    this.selectedOrder = this.salesOrders[index];
    this.selectedOrderNumber = index;
    console.log(this.selectedOrder);
    this.activePage = this.REVIEW_SALE_PAGE;
  }

  totalSumInclVAT(): number {
    return totalSumInclVAT(this.selectedOrder);
  }

  totalSumExclVAT(): number {
    return totalSumExclVAT(this.selectedOrder);
  }

  orderDisplayText(orderLine: OrderLine): string {
    return `${orderLine.product.itemName} ${orderLine.amount} ${orderLine.product.quantityCode}, á ${orderLine.product.price}
    ${this.actingStore.currency} (VAT ${orderLine.product.vatRate} %)`;
  }

  totalVAT(): number {
    return round(this.totalSumInclVAT() - this.totalSumExclVAT());
  }

  onNavigateBackFromOrder() {
    this.activePage = this.REVIEW_SALES_PAGE;
  }

  onAcceptOrder() {
    this.sandboxService.submitMultiOrderLinesPurchase(this.selectedOrder)
      .subscribe(() => {
        this.salesOrders.splice(this.selectedOrderNumber);
        this.companyService.saveCompanies();
        this.onNavigateBackFromOrder();
      });
  }

  private onCompanyChanged(company: Company) {
    this.actingStore = this.storeService.getStore(company.id);
    this.actingCompany = this.companyService.getCompany(company.id);
    if (!this.actingStore) {
      this.router.navigate(['/']);
    }
    this.salesOrders = company.orders;
  }
}
