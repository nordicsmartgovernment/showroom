import { Component, OnInit } from '@angular/core';
import { Company, CompanyService } from '../shared/company.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  actingCompany: Company;
  otherCompanies: Company[];

  constructor(private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.populateCompanyInfo();
  }

  changeCompanyTo(company: Company) {
    this.companyService.actAsCompany(company.id);
    this.populateCompanyInfo();
  }

  private populateCompanyInfo() {
    this.actingCompany = this.companyService.getActingCompany();
    this.otherCompanies = this.companyService.getAllCompanies().filter(c => c !== this.actingCompany);
  }

}
