import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { ActivatedRoute } from '@angular/router';
import { Product, Store } from '../store.model';
import { SandboxService } from '../../../shared/sandbox.service';

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
              private sandboxService: SandboxService) {
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

  checkout() {
    // Send documents to sandbox here
  }

}
