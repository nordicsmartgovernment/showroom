import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '../../../shared/store.model';
import {StoreService} from '../../../shared/store.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Company, CompanyService} from '../../../shared/company.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-shop-selection',
  templateUrl: './purchase-shop-selection.component.html',
  styleUrls: ['./purchase-shop-selection.component.css']
})
export class PurchaseShopSelectionComponent implements OnInit, OnDestroy {
  stores: Store[];
  private actingCompany: Company;
  private actingCompanySubscription: Subscription;

  constructor(private storeService: StoreService,
              private router: Router,
              private companyService: CompanyService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.actingCompany = this.companyService.getActingCompany();
    this.onActingCompanyChanged();
    this.actingCompanySubscription = this.companyService.actingCompanyChanged
      .subscribe(company => {
          this.actingCompany = company;
          this.onActingCompanyChanged();
        }
      );
  }

  ngOnDestroy(): void {
    this.actingCompanySubscription.unsubscribe();
  }

  onActingCompanyChanged() {
    this.stores = this.storeService.getStores()
      .filter(store => store.id !== this.actingCompany.id);
  }

  onGoToStore(store: number) {
    this.router.navigate([store], {relativeTo: this.route});
  }
}
