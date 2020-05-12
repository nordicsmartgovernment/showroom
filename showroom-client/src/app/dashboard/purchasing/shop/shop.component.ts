import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { ActivatedRoute } from '@angular/router';
import { Product, Store } from '../store.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  store: Store;

  constructor(private storeService: StoreService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.store = this.storeService.getStore(params.id);
    });
  }

}
