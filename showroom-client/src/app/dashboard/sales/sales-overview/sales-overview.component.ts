import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order, OrderLine} from '../../ordering/order.component';
import {v4 as UUIDv4} from 'uuid';
import {Company, CompanyService} from '../../../shared/company.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {StoreService} from '../../../shared/store.service';
import {PurchaseDetails, SandboxService} from '../../../shared/sandbox.service';
import {round, totalSumExclVAT, totalSumInclVAT} from '../../../shared/utils/vatUtil';
import {MatTableDataSource} from '@angular/material/table';
import {CurrencyService} from '../../../shared/currency.service';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.css']
})
export class SalesOverviewComponent implements OnInit, OnDestroy {
  readonly REVIEW_SALES_PAGE = 'reviewSales';
  readonly REVIEW_SALE_PAGE = 'reviewSale';
  readonly REVIEW_REINVOICE_PAGE = 'reviewReinvoicePage';
  activePage = this.REVIEW_SALES_PAGE;
  salesOrders: Order[];
  selectedOrder: Order;
  purchases: PurchaseDetails[];
  orderColumns: string[] = ['orderLines', 'price', 'customer', 'address', 'action'];
  salesOrdersTableData: MatTableDataSource<Order>;
  purchaseColumns: string[] = ['purchaseDescription', 'price', 'customer', 'address', 'action'];
  selectedPurchase: PurchaseDetails;
  actingCompanyCurrency: string;
  selectedReinvoiceCompany: Company;
  isLoadingPurchases: boolean;
  private selectedOrderNumber: number;
  private actingCompany: Company;
  private actingCompanySubscription: Subscription;

  constructor(private companyService: CompanyService,
              private router: Router,
              private route: ActivatedRoute,
              private storeService: StoreService,
              private currencyService: CurrencyService,
              private sandboxService: SandboxService) {
  }

  ngOnDestroy(): void {
    this.actingCompanySubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.onCompanyChanged(this.companyService.getActingCompany());


    this.actingCompanySubscription = this.companyService.actingCompanyChanged.subscribe(
      company => {
        this.onCompanyChanged(company);
      }
    );
  }

  onRejectOrder(indexOrOrder: number | Order) {
    let index;
    index = this.getIndex(indexOrOrder);
    this.salesOrders.splice(index, 1);
    this.salesOrdersTableData.data = this.salesOrders;
    this.companyService.saveCompanies();
  }

  getCompany(companyId: number): Company {
    return this.companyService.getCompany(companyId);
  }

  onReviewOrder(indexOrOrder: number | Order) {
    let index;
    index = this.getIndex(indexOrOrder);
    this.selectedOrderNumber = index;

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
    ${this.actingCompanyCurrency} (VAT ${orderLine.product.vatRate} %)`;
  }

  totalVAT(): number {
    return round(this.totalSumInclVAT() - this.totalSumExclVAT());
  }

  onNavigateBackToSales() {
    this.activePage = this.REVIEW_SALES_PAGE;
    this.selectedPurchase = null;
    this.selectedReinvoiceCompany = null;
    this.selectedOrder = null;
    this.selectedOrderNumber = null;
  }

  onAcceptOrder() {
    this.sandboxService.submitMultiOrderLinesPurchase(this.selectedOrder)
      .subscribe(() => {
        this.salesOrders.splice(this.selectedOrderNumber, 1);
        this.salesOrdersTableData.data = this.salesOrders;
        this.companyService.saveCompanies();
        this.onNavigateBackToSales();
      });
  }

  assertOrder(element: any): Order {
    return element;
  }

  assertPurchaseDetails(element: any): PurchaseDetails {
    return element;
  }

  priceIncludingVat(order: Order): number {
    return totalSumInclVAT(order);
  }

  getCompanyAddressDisplayLine(companyId: number) {
    const buyerCompany = this.getCompany(companyId);
    return `${buyerCompany.streetName}, ${buyerCompany.postCodeIdentifier}, ${buyerCompany.townName}`;
  }

  getCompanyDisplayLine(companyId: number) {
    const buyerCompany = this.getCompany(companyId);
    return `${buyerCompany.name} (${buyerCompany.postCodeIdentifier}), ${buyerCompany.townName}`;
  }

  onReinvoicePurchase(purchase: PurchaseDetails) {
    this.selectedPurchase = purchase;
    this.activePage = this.REVIEW_REINVOICE_PAGE;
  }

  onSubmitReinvoice() {
    this.sandboxService.submitMultiOrderLinesPurchase(
      {
        orderId: UUIDv4(),
        buyer: this.selectedReinvoiceCompany.id,
        seller: this.actingCompany.id,
        orderLines: [
          {
            product: this.storeService.findProduct(this.selectedPurchase.productId),
            amount: this.selectedPurchase.amount
          }
        ]
      }
    );
  }

  getInvoiceableCompanies(): Company[] {
    return this.companyService.getAllCompanies()
      .filter(company => company.id !== this.selectedPurchase.sellerId && company.id !== this.actingCompany.id);
  }

  private getIndex(indexOrOrder: number | Order) {
    if (typeof indexOrOrder === 'number') {
      return indexOrOrder;
    } else {
      return this.salesOrders.findIndex(order => order.orderId === indexOrOrder.orderId);
    }
  }

  private onCompanyChanged(company: Company) {
    this.actingCompany = this.companyService.getCompany(company.id);
    this.salesOrders = this.actingCompany.orders;
    this.salesOrdersTableData = new MatTableDataSource<Order>(this.salesOrders);
    this.salesOrders = company.orders;
    this.isLoadingPurchases = true;
    this.purchases = [];
    this.sandboxService.getPurchaseDetailsForActingCompany()
      .then(purchases => this.purchases = purchases)
      .finally(() => this.isLoadingPurchases = false);
    this.actingCompanyCurrency = this.currencyService.getActingCompanyCurrency();
  }
}
