import { Component, OnInit } from '@angular/core';
import { Company, CompanyService } from '../shared/company.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  company: Company;

  constructor(private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.company = this.companyService.getCurrentCompany();
  }

}
