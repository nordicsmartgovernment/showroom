import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { ActivatedRoute } from '@angular/router';
import { SandboxService } from '../../../shared/sandbox.service';
import { CompanyService } from '../../../shared/company.service';
import { Product, Store } from '../../../shared/store.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  store: Store;
  productInCart: Product;
  amount: number;

  constructor(private storeService: StoreService,
              private route: ActivatedRoute,
              private sandboxService: SandboxService,
              private companyService: CompanyService) {
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
    return this.netPrice() * 0.25;
  }

  totalPrice(): number {
    return this.netPrice() + this.vatPrice();
  }

  checkout() {
    // Send documents to sandbox here
    this.sandboxService.postBankStatement(
      this.totalPrice(),
      this.companyService.getActingCompany(),
      this.store);
  }

}
