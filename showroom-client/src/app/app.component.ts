import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Company, CompanyService} from './shared/company.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'NGS Showroom';
  // Clears local data if they are not from the current version.
  actingCompany: Company;
  // used to clear the local storage if there is a new version of the showroom
  private readonly CURRENT_DATA_VERSION = 1;
  private readonly DATA_VERSION_KEY = 'DATA_VERSION';
  private actingCompanySubscription: Subscription;

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private companyService: CompanyService) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/mdi.svg')
    );
    this.checkDataVersion();
  }

  private checkDataVersion() {
    const dataVersion = localStorage.getItem(this.DATA_VERSION_KEY);
    if (!dataVersion || +dataVersion < this.CURRENT_DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem(this.DATA_VERSION_KEY, '' + this.CURRENT_DATA_VERSION);
    }
  }

  background() {
    return this.actingCompany.backgroundImage;
  }

  ngOnInit(): void {
    this.actingCompany = this.companyService.getActingCompany();
    this.actingCompanySubscription = this.companyService.actingCompanyChanged
      .subscribe(company => this.actingCompany = company);
  }

  ngOnDestroy(): void {
    this.actingCompanySubscription.unsubscribe();
  }
}
