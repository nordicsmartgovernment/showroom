import {Component, OnDestroy, OnInit} from '@angular/core';
import {Company, CompanyService} from '../../shared/company.service';
import {Subscription} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.css'],
})
export class CashflowComponent implements OnInit, OnDestroy {
  private actingCompanyChangedSubscription: Subscription;
  actingCompany: Company;
  safeUrl: SafeResourceUrl;
  showCashflow = false;
  isLoading = false;

  constructor(private companyService: CompanyService,
              private dom: DomSanitizer) { }

  ngOnInit(): void {
    this.actingCompany = this.companyService.getActingCompany();
    this.onCompanyChanged();
    this.actingCompanyChangedSubscription = this.companyService.actingCompanyChanged
      .subscribe(company => {
        this.actingCompany = company;
        this.onCompanyChanged();
      });
  }

  ngOnDestroy(): void {
    this.actingCompanyChangedSubscription.unsubscribe();
  }

  onCompanyChanged() {
    this.showCashflow = false;
    setTimeout(() => {
      this.showCashflow = true;
      this.isLoading = true;
    }, 500);
    this.isLoading = true;
    const url = 'http://173.82.108.98/cashflow.html?companyId=' + this.actingCompany.id;
    this.safeUrl =  this.dom.bypassSecurityTrustResourceUrl(url);
  }

  onLoaded() {
    this.isLoading = false;
  }
}
