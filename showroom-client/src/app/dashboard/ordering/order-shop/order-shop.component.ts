import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StoreService} from '../../../shared/store.service';
import {Product, Store} from '../../../shared/store.model';
import {CompanyService} from '../../../shared/company.service';
import {v4 as UUIDv4} from 'uuid';
import {priceExcludingVAT, priceIncludingVAT, totalSumExclVAT, totalSumInclVAT} from '../../../shared/utils/vatUtil';

export interface Order {
  orderLines: OrderLine[];
  orderId: string;
  buyer?: number;
  seller?: number;
}

export interface OrderLine {
  product: Product;
  amount: number;
}

@Component({
  selector: 'app-order-shop',
  templateUrl: './order-shop.component.html',
  styleUrls: ['./order-shop.component.css']
})
export class OrderShopComponent implements OnInit {
  readonly CREATE_ORDER_PAGE = 'createOrder';
  readonly REVIEW_ORDER_PAGE = 'reviewOrder';
  order: Order;
  orderLines: OrderLine[];
  activePage = this.CREATE_ORDER_PAGE;
  activeStore: Store;


  constructor(private router: Router,
              private companyService: CompanyService,
              private storeService: StoreService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.orderLines = [];
    this.activeStore = this.storeService.getStore(this.route.snapshot.params.id);
    this.order = {
      orderLines: this.orderLines,
      orderId: UUIDv4(),
    };
    for (const product of this.activeStore.storeProductSelection) {
      this.orderLines.push({
        product,
        amount: 0,
      });
    }
  }

  onInputChanged(product: Product, orderLine: OrderLine, newAmount: number) {
    if (typeof newAmount !== 'number' || !newAmount || newAmount < 0) {
      newAmount = 0;
    }
    orderLine.amount = newAmount;
  }

  adjustAmount(orderLineNumber: number, amount: number) {
    if (amount + this.orderLines[orderLineNumber].amount >= 0) {
      this.orderLines[orderLineNumber].amount += amount;
    }
  }

  onNavigateBack() {
    this.router.navigate(['/ordering']);
  }

  onReviewOrder() {
    this.activePage = this.REVIEW_ORDER_PAGE;
  }

  getActiveOrderLines(): OrderLine[] {
    return this.orderLines.filter(order => order.amount > 0);
  }

  priceIncludingVAT(orderLine: OrderLine): number {
    return priceIncludingVAT(orderLine);
  }

  priceExcludingVAT(orderLine: OrderLine): number {
    return priceExcludingVAT(orderLine);
  }

  totalSumInclVAT(): number {
    return totalSumInclVAT(this.order);
  }

  totalSumExclVAT(): number {
    return totalSumExclVAT(this.order);
  }

  onNavigateBackToStore() {
    this.activePage = this.CREATE_ORDER_PAGE;
  }

  onSubmitOrder() {
    this.order.orderLines = this.order.orderLines.filter(orderLine => orderLine.amount > 0);
    this.order.buyer = this.companyService.getActingCompany().id;
    this.order.seller = this.activeStore.id;
    this.companyService.getCompany(this.route.snapshot.params.id.toString()).orders.push(this.order);
    this.companyService.saveCompanies();
    this.onNavigateBack();
  }
}
