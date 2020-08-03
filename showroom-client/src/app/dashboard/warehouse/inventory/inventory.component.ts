import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {InventoryService} from '../../../shared/inventory.service';
import {InventoryProduct} from '../../../shared/inventory.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  inventory: InventoryProduct[];

  constructor(private router: Router,
              private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory = this.inventoryService.inventory;
    this.inventoryService.inventoryChanged
      .subscribe(change => {
        this.inventory = change;
      });
  }

  navigateBack() {
    this.router.navigate(['/warehouse']);
  }

  onSubtractAmount(i: InventoryProduct) {
    if (i.amount > 1) {
      i.price -= i.price / i.amount;
      i.amount--;
      this.inventoryChanged();
    }
  }

  onAddAmount(i: InventoryProduct) {
    i.price += i.price / i.amount;
    i.amount++;
    this.inventoryChanged();
  }

  // Gets called before the ngmodel updates the amount
  onInputChanged(product: InventoryProduct, newAmount: number) {
    console.log(newAmount);
    if (typeof newAmount !== 'number' || !newAmount || newAmount < 1) {
      newAmount = 1;
    }
    console.log(newAmount);
    console.log(product.amount);
    product.price += (product.price / product.amount) * (newAmount - product.amount);
    product.amount = newAmount;
  }

  private inventoryChanged() {
    this.inventoryService.pushInventoryChangedEvent();
  }
}
