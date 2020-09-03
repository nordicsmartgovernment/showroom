import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Company, CompanyService} from '../../../shared/company.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.css']
})
export class InvoicingComponent implements OnInit, OnDestroy {
  selectedInvoiceCompany: Company;
  actingCompany: Company;
  private actingCompanySubscription: Subscription;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.actingCompany = this.companyService.getActingCompany();
    this.actingCompanySubscription = this.companyService.actingCompanyChanged
      .subscribe(company => this.actingCompany = company);
  }

  onSubmit(form: NgForm) {
    // TODO
  }

  getInvoiceableCompanies(): Company[] {
    return this.companyService.getAllCompanies()
      .filter(company => company.id !== this.actingCompany.id);
  }

  ngOnDestroy(): void {
    this.actingCompanySubscription.unsubscribe();
  }
}
