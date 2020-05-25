import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from './company.service';
import { Store } from './store.model';


const SANDBOX_URL = 'http://35.228.14.238:8080/';
const TRANSACTIONS_PATH = 'transactions';
const DOCUMENTS_PATH = 'document';
const BANK_STATEMENT_TYPE = 'application/vnd.nordicsmartgovernment.bank-statement';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {

  private bankStatementTemplate: string;

  constructor(private http: HttpClient) {
    this.getTemplate('bankStatementTemplate.xml', template => this.bankStatementTemplate = template);
  }

  getCompanyIds() {
    return this.http.get(SANDBOX_URL + TRANSACTIONS_PATH);
  }

  postDocument(companyId: number, documentType: string, payload: string) {
    return this.http.post(SANDBOX_URL + DOCUMENTS_PATH, payload, {
      headers: new HttpHeaders({ 'Content-Type': documentType })
    });

  }

  submitPurchase(price: number, buyer: Company, seller: Store) {
    // This template-style XML generation is a quick-fix - it would be preferable to generate from
    // objects using some library

    const now = new Date();
    const nowString = now.toISOString();
    const twoMinBeforeNowString = new Date(now.getTime() - 120000).toISOString();
    const oneMinBeforeNowString = new Date(now.getTime() - 60000).toISOString();
    const dateNowString = nowString.substr(0, 10);

    // These two be provided, needs to be the same in multiple documents
    const invoiceId = this.randomString();
    const paymentReference = this.randomString();

    const buyerInfo = {
      $MessageID$: this.randomString(),
      $CompanyName$: buyer.name,
      $CompanyID$: buyer.id.toString(),
      $CompanyIBAN$: buyer.iban,
      $OtherCompanyName$: seller.name,
      $DateTimeNow$: nowString,
      $DateNow$: dateNowString,
      $SeqNumber$: '' + Math.floor(Math.random() * 9999),
      $DateTimePurchaseFrom$: twoMinBeforeNowString,
      $DateTimePurchaseTo$: oneMinBeforeNowString,
      $TransactionType$: 'DBIT',
      $TotalDebit$: '' + price,
      $TotalCredit$: '0.00',
      $TotalPrice$: '' + price,
      $Currency$: seller.currency,
      $InvoiceID$: invoiceId,
      $PaymentReference$: paymentReference,
    };

    const buyerStatement = populateTemplate(this.bankStatementTemplate, buyerInfo);
    console.log('Buyer\'s bank statement:');
    console.log(buyerStatement);

    const sellerInfo = {
      $MessageID$: this.randomString(),
      $CompanyName$: seller.name,
      $CompanyID$: seller.id.toString(),
      $CompanyIBAN$: seller.iban,
      $OtherCompanyName$: buyer.name,
      $DateTimeNow$: nowString,
      $DateNow$: dateNowString,
      $SeqNumber$: '' + Math.floor(Math.random() * 9999),
      $DateTimePurchaseFrom$: twoMinBeforeNowString,
      $DateTimePurchaseTo$: oneMinBeforeNowString,
      $TransactionType$: 'CRDT',
      $TotalDebit$: '0.00',
      $TotalCredit$: '' + price,
      $TotalPrice$: '' + price,
      $Currency$: seller.currency,
      $InvoiceID$: invoiceId,
      $PaymentReference$: paymentReference,
    };

    const sellerStatement = populateTemplate(this.bankStatementTemplate, sellerInfo);
    console.log('Sellers\'s bank statement:');
    console.log(sellerStatement);

    return buyerInfo;
  }

  private getTemplate(name: string, successAction) {
    this.http.get('assets/templates/' + name, { responseType: 'text' })
      .subscribe(successAction);
  }

  private randomString(): string {
    // Silly code I found for generating a random string, should probably be an UUID
    return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
  }

}

function populateTemplate(template: string, info: { [id: string]: string }): string {
  let replaced = template;

  for (const [replacePattern, replacement] of Object.entries(info)) {
    // A weird javascript approach to "replace all occurrences" without needing regexp
    replaced = replaced.split(replacePattern).join(replacement);
  }

  return replaced;
}
