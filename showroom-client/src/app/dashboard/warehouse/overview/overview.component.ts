import {Component, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryService} from '../../../shared/inventory.service';
import {InventoryProduct} from '../../../shared/inventory.model';
import {CurrencyService} from '../../../shared/currency.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  inventory: InventoryProduct[];

  constructor(private sandboxService: SandboxService,
              private router: Router,
              private currencyService: CurrencyService,
              private inventoryService: InventoryService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.inventory = this.inventoryService.inventory;
    this.inventoryService.inventoryChanged
      .subscribe(change => {
        this.inventory = change;
      });
  }

  navigateTo(page: string) {
    this.router.navigate([page], {relativeTo: this.route});
  }


  convertToCompanyCurrency(i: InventoryProduct): number {
    return this.currencyService.convertToActingCompanyCurrency(i.price, i.currency);
  }

  companyCurrency(): string {
    return this.currencyService.getActingCompanyCurrency();
  }
}
