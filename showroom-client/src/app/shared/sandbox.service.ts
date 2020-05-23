import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from './company.service';
import { Store } from './store.model';


const SANDBOX_URL = 'http://35.228.14.238:8080/';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {

  private bankStatementBuyerTemplate: string;

  constructor(private http: HttpClient) {
    this.getTemplate('bankStatementBuyerTemplate.xml', template => this.bankStatementBuyerTemplate = template);
  }

  getCompanyIds() {
    return this.http.get(SANDBOX_URL + 'transactions');
  }

  postBankStatement(price: number, buyer: Company, seller: Store) {
    const now = new Date();
    const oneMinBeforeNow = new Date(now.getTime() - 60000);
    const twoMinBeforeNow = new Date(now.getTime() - 120000);

    const replacements = {
      // Silly code I found for generating a random string, should probably be an UUID
      $MessageID$: [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
      $BuyerName$: buyer.name,
      $BuyerID$: buyer.id.toString(),
      $SellerName$: seller.name,
      $DateTimeNow$: now.toISOString(),
      $DateNow$: now.toDateString(),
      $SeqNumber$: '' + Math.floor(Math.random() * 9999),
      $DateTimePurchaseFrom$: '' + twoMinBeforeNow,
      $DateTimePurchaseTo$: '' + oneMinBeforeNow,
      $BuyerIBAN$: buyer.iban,
      $TotalPrice$: '' + price,
      $Currency$: seller.currency,
      // These two be provided, needs to be the same in multiple documents
      $InvoiceID$: [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
      $PaymentReference$: [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
    };

    console.log(replacements);
    const statement = replaceIn(this.bankStatementBuyerTemplate, replacements);

    console.log(statement);
  }

  private getTemplate(name: string, successAction) {
    this.http.get('assets/templates/' + name, { responseType: 'text' })
      .subscribe(successAction);
  }

}

function replaceIn(template: string, replacements: { [id: string]: string }): string {
  let replaced = template;

  for (const [replacePattern, replacement] of Object.entries(replacements)) {
    // A weird javascript approach to "replace all occurrences" without needing regexp
    replaced = replaced.split(replacePattern).join(replacement);
  }

  return replaced;
}
