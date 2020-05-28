import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {

  stores = this.storeService.getStores();

  constructor(private storeService: StoreService) {
  }

  ngOnInit(): void {
  }

}
