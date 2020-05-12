import { Component, OnInit } from '@angular/core';
import { StoreService } from './store.service';

@Component({
  selector: 'app-purchasing',
  templateUrl: './purchasing.component.html',
  styleUrls: ['./purchasing.component.css'],
  providers: [StoreService]
})
export class PurchasingComponent implements OnInit {

  // TODO This component is probably not needed

  constructor() {
  }

  ngOnInit(): void {
  }

}
