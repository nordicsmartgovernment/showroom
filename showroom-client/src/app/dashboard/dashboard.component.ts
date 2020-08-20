import {Component, OnInit} from '@angular/core';
import {Page, PAGES} from '../shared/page.constants';
import {SnackbarService} from '../shared/snackbar.service';
import {SALES_ROUTE} from '../shared/routing.constants';
import {CompanyService} from '../shared/company.service';
import {StoreService} from '../shared/store.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards: Page[] = PAGES;

  constructor(private snackBarService: SnackbarService,
              private companyService: CompanyService,
              private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.snackBarService.showIntroPopup();
  }

  getCards(): Page[] {
    const salesPage = this.cards.find(card => card.route === SALES_ROUTE);
    salesPage.active = this.isActingAsStore();
    return this.cards;
  }

  private isActingAsStore(): boolean {
    const actingCompanyId = this.companyService.getActingCompany().id;
    return !!this.storeService.getStore(actingCompanyId);
  }


}
