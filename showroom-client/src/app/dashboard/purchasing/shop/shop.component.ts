import {Component, OnInit} from '@angular/core';
import {StoreService} from '../../../shared/store.service';
import {ActivatedRoute} from '@angular/router';
import {PurchaseDescription, SandboxService} from '../../../shared/sandbox.service';
import {CompanyService} from '../../../shared/company.service';
import {Product, Store} from '../../../shared/store.model';
import {OrderconfirmedComponent} from './orderconfirmed/orderconfirmed.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  store: Store;
  productInCart: Product;
  amount: number;
  loading = false;

  constructor(private storeService: StoreService,
              private route: ActivatedRoute,
              private sandboxService: SandboxService,
              private companyService: CompanyService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.store = this.storeService.getStore(params.id);
    });
  }

  addToCart(product: Product) {
    this.productInCart = product;

    // Buying one of the product is the default
    this.amount = 1;
  }

  netPrice(): number {
    return this.productInCart.price * this.amount;
  }

  vatPrice(): number {
    return this.netPrice() * (this.productInCart.vatRate / 100);
  }

  totalPrice(): number {
    return this.netPrice() + this.vatPrice();
  }

  onInputChanged(newAmount: number) {
    if (typeof newAmount !== 'number' || !newAmount || newAmount < 1) {
      newAmount = 1;
    }
    this.amount = newAmount;
  }

  checkout(card: boolean) {
    if (!this.amount || this.amount < 1) {
      return;
    }
    this.loading = true;

    const purchase: PurchaseDescription = {
      paidByCard: card,
      totalPriceExclVat: this.netPrice(),
      vatPrice: this.vatPrice(),
      totalPriceInclVat: this.totalPrice(),
      amount: this.amount
    };

    const openConfirmation = _ => {
      this.loading = false;
      this.dialog.open(OrderconfirmedComponent, {
        data: { paidByCard: card},
        disableClose: true
      });
    };

    this.sandboxService.submitPurchase(purchase, this.productInCart, this.companyService.getActingCompany(), this.store)
      .subscribe(openConfirmation);
  }

}
