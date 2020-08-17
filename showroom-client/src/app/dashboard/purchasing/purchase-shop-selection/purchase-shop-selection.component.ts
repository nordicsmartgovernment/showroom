import { Component, OnInit } from '@angular/core';
import {Store} from '../../../shared/store.model';
import {StoreService} from '../../../shared/store.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order-shop-selection',
  templateUrl: './purchase-shop-selection.component.html',
  styleUrls: ['./purchase-shop-selection.component.css']
})
export class PurchaseShopSelectionComponent implements OnInit {
  stores: Store[];

  constructor(private storeService: StoreService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.stores = this.storeService.getStores();
  }

  onGoToStore(store: number) {
    this.router.navigate([store], {relativeTo: this.route});
  }
}
