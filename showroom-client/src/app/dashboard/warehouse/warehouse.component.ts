import {Component, OnInit} from '@angular/core';
import {SandboxService} from '../../shared/sandbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryProduct, InventoryService} from '../../shared/inventory.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  activePage = 'inventory-view';
  private inventory: InventoryProduct[];

  constructor(private sandboxService: SandboxService,
              private router: Router,
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
    this.activePage = page;
    this.router.navigate([page], {relativeTo: this.route});
  }

}
