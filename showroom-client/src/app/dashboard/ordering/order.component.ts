import {Component, OnInit} from '@angular/core';
import {Product, Store} from '../../shared/store.model';
import {StoreService} from '../../shared/store.service';
import {Router} from '@angular/router';
import {CurrencyService} from '../../shared/currency.service';
import {OrderCalc, priceExcludingVAT, priceIncludingVAT, round} from '../../shared/utils/vatUtil';
import {SandboxService} from '../../shared/sandbox.service';
import {CompanyService} from '../../shared/company.service';
import {v4 as UUIDv4} from 'uuid';

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
  selector: 'app-order-shop-selection',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  stores: Store[];
  tableRows: ProductDisplayElement[];
  displayedColumns: string[] = ['productName', 'price', 'storeName', 'amount'];
  readonly CREATE_ORDER_PAGE = 'createOrder';
  readonly REVIEW_ORDER_PAGE = 'reviewOrder';
  activePage = this.CREATE_ORDER_PAGE;

  constructor(private storeService: StoreService,
              private router: Router,
              private sandboxService: SandboxService,
              private companyService: CompanyService,
              private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.stores = this.storeService.getStores();
    this.tableRows = this.getStoreCatalogue();
  }

  getStoreCatalogue(): ProductDisplayElement[] {
    const catalogue: ProductDisplayElement[] = [];
    this.stores.forEach(store => {
      store.storeProductSelection.forEach(product => {
        catalogue.push({product, store, amount: 0});
      });
    });
    return catalogue;
  }

  assertItemType(model: ProductDisplayElement): ProductDisplayElement {
    return model;
  }

  onInputChanged(element: ProductDisplayElement, newAmount: number) {
    if (typeof newAmount !== 'number' || !newAmount || newAmount < 0) {
      newAmount = 0;
    }
    element.amount = newAmount;
  }

  adjustAmount(element: ProductDisplayElement, amount: number) {
    if (amount + element.amount >= 0) {
      element.amount += amount;
    }
  }

  noProductsAddedToOrder(): boolean {
    return !this.tableRows.some(row => row.amount && row.amount > 0);
  }

  onReviewOrder() {
    this.activePage = this.REVIEW_ORDER_PAGE;
  }


  getActiveOrderLines(): ProductDisplayElement[] {
    return this.tableRows.filter(order => order.amount > 0);
  }

  priceIncludingVAT(orderLine: ProductDisplayElement): number {
    const price = priceIncludingVAT(this.displayElementToOrderCalc(orderLine));
    return this.currencyService.convertToActingCompanyCurrency(price, orderLine.store.currency);
  }

  priceExcludingVAT(orderLine: ProductDisplayElement): number {
    const price = priceExcludingVAT(this.displayElementToOrderCalc(orderLine));
    return this.currencyService.convertToActingCompanyCurrency(price, orderLine.store.currency);
  }

  totalSumInclVAT(): number {
    return round(this.getActiveOrderLines()
      .map(orderLine => this.priceIncludingVAT(orderLine))
      .reduce((a, b) => b + a, 0));
  }

  totalSumExclVAT(): number {
    return round(this.getActiveOrderLines()
      .map(orderLine => this.priceExcludingVAT(orderLine))
      .reduce((a, b) => b + a, 0));
  }

  getActingCompanyCurrency() {
    return this.currencyService.getActingCompanyCurrency();
  }

  displayElementToOrderCalc(orderLine: ProductDisplayElement): OrderCalc {
    return {
      price: orderLine.product.price,
      amount: orderLine.amount,
      vatRate: orderLine.product.vatRate
    };
  }

  onNavigateBack() {
    this.activePage = this.CREATE_ORDER_PAGE;
  }

  onSubmitOrder() {
    const storeOrderMap = new Map<number, ProductDisplayElement[]>();
    const activeOrderLines = this.getActiveOrderLines();
    activeOrderLines.forEach(orderLine => {
      if (!storeOrderMap.get(orderLine.store.id)) {
        storeOrderMap.set(orderLine.store.id, []);
      }
      storeOrderMap.get(orderLine.store.id).push(orderLine);
    });

    storeOrderMap.forEach(((productDisplayElement, store) => {
      let order: Order;
      order = {
        seller: store,
        buyer: this.companyService.getActingCompany().id,
        orderId: UUIDv4(),
        orderLines: productDisplayElement.map(el => {
          return {
            amount: el.amount,
            product: el.product
          };
        })
      };
      this.companyService.getCompany(store).orders.push(order);
    }));
    this.companyService.saveCompanies();
    this.clearAmounts();
    this.onNavigateBack();
  }

  getProductDisplayPrice(tableDisplayLine: ProductDisplayElement): string {
    const displayAmount =
      this.currencyService.convertToActingCompanyCurrency(
        tableDisplayLine.product.price,
        tableDisplayLine.store.currency);
    return `${displayAmount} ${this.getActingCompanyCurrency()}`;
  }

  private clearAmounts() {
    this.tableRows.forEach(row => row.amount = 0);
  }
}

// Using an interface to give a hint to the IDE what is being returned from getStoreCatalogue
interface ProductDisplayElement {
  store: Store;
  product: Product;
  amount?: number;
}
