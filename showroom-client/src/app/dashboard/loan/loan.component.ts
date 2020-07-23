import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {SandboxService} from '../../shared/sandbox.service';
import {CompanyService} from '../../shared/company.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  LOAN_FORM = 'loanForm';
  DISPLAY_BANKS = 'displayBanks';
  REQUEST_DATA = 'requestData';
  GET_OFFERS = 'getOffers';
  DISPLAY_RESULT = 'displayResult';
  formContent: { amount: number, paybackTime: number, purpose: string };
  activePage = this.LOAN_FORM;
  banks = [
    'Nordea',
    'City Bank',
    'Danske Bank',
  ];
  selectedBank: string;
  interest: string = (Math.random() * 10 + 10).toFixed(2);

  constructor(private sandboxService: SandboxService, private companyService: CompanyService) {
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.formContent = form.value;
    this.navigateTo(this.DISPLAY_BANKS);
  }

  onRequestQuotation(bank: string) {
    this.selectedBank = bank;
    this.activePage = this.REQUEST_DATA;
  }

  navigateTo(page: string) {
    this.activePage = page;
  }

  onAcceptOffer() {
    this.navigateTo(this.DISPLAY_RESULT);
    this.sandboxService.submitLoan(this.companyService.getActingCompany(), this.formContent.amount, this.selectedBank);
  }
}
