import {Component, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryProduct, InventoryService} from '../../../shared/inventory.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  inventory: InventoryProduct[];
  PURCHASE_INVENTORY_KEY = 'inventory';

  constructor(private sandboxService: SandboxService,
              private router: Router,
              private inventoryService: InventoryService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const savedInventory = localStorage.getItem(this.PURCHASE_INVENTORY_KEY);
    if (savedInventory) {
      this.inventory = JSON.parse(savedInventory);
    }
    this.inventory = this.inventoryService.inventory;
    this.inventoryService.inventoryChanged
      .subscribe(change => {
        this.inventory = change;
      });
  }

  navigateTo(page: string) {
    this.router.navigate([page], {relativeTo: this.route});
  }
}
