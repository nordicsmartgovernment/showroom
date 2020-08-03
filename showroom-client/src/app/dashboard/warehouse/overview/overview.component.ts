import {Component, OnInit} from '@angular/core';
import {SandboxService} from '../../../shared/sandbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryService} from '../../../shared/inventory.service';
import {InventoryProduct} from '../../../shared/inventory.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  inventory: InventoryProduct[];

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
    this.router.navigate([page], {relativeTo: this.route});
  }
}
