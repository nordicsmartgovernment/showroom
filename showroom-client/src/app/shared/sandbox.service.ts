import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from './company.service';
import { Store } from './store.model';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';


const SANDBOX_URL = 'http://35.228.14.238:8080/';
const TRANSACTIONS_PATH = 'transactions';
const DOCUMENTS_PATH = 'document';
const BANK_STATEMENT_TYPE = 'application/vnd.nordicsmartgovernment.bank-statement';
const RECEIPT_TYPE = 'application/vnd.nordicsmartgovernment.receipt';
const INVOICE_TYPE = 'application/vnd.nordicsmartgovernment.sales-invoice';


export interface PurchaseDescription {
  paidByCard: boolean; // If true, generate eReceipt, if false assume paid by invoice (generate eInvoice)
  totalPriceExclVat: number;
  vatPrice: number;
  totalPriceInclVat: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SandboxService {

  private bankStatementTemplate: string;
  private eInvoiceTemplate: string;
  private eReceiptTemplate: string;

  constructor(private http: HttpClient) {
    this.getTemplate('bankStatementTemplate.xml', template => this.bankStatementTemplate = template);
    this.getTemplate('finvoice_eInvoiceTemplate.xml', template => this.eInvoiceTemplate = template);
    this.getTemplate('finvoice_eReceiptTemplate.xml', template => this.eReceiptTemplate = template);
  }

  getCompanyIds() {
    return this.http.get(SANDBOX_URL + TRANSACTIONS_PATH);
  }

  postDocument(companyId: number, documentType: string, payload: string) {
    return this.http.post(SANDBOX_URL + DOCUMENTS_PATH, payload, {
      headers: new HttpHeaders({ 'Content-Type': documentType })
    });

  }

  submitPurchase(purchase: PurchaseDescription, buyer: Company, seller: Store): Observable<any[]> {
    // This template-style XML generation is a quick-fix - it would be preferable to generate from
    // objects using some library

    const now = new Date();
    const nowISOString = now.toISOString();
    const twoMinBeforeNowISOString = new Date(now.getTime() - 120000).toISOString();
    const oneMinBeforeNowISOString = new Date(now.getTime() - 60000).toISOString();
    const dateNowISOString = nowISOString.substr(0, 10);

    // These two be provided, needs to be the same in multiple documents
    const invoiceId = this.randomString();
    const paymentReference = this.randomString();


    // Buyer bank statement
    const buyerStatementInfo = {
      $MessageID$: this.randomString(),
      $CompanyName$: buyer.name,
      $CompanyID$: buyer.id.toString(),
      $CompanyIBAN$: buyer.iban,
      $OtherCompanyName$: seller.name,
      $DateTimeNow$: nowISOString,
      $DateNow$: dateNowISOString,
      $SeqNumber$: this.randomNumberString(),
      $DateTimePurchaseFrom$: twoMinBeforeNowISOString,
      $DateTimePurchaseTo$: oneMinBeforeNowISOString,
      $TransactionType$: 'DBIT',
      $TotalDebit$: '' + purchase.totalPriceInclVat,
      $TotalCredit$: '0.00',
      $TotalPrice$: '' + purchase.totalPriceInclVat,
      $Currency$: seller.currency,
      $InvoiceID$: invoiceId,
      $PaymentReference$: paymentReference
    };

    const buyerStatement = populateTemplate(this.bankStatementTemplate, buyerStatementInfo);
    console.log('Buyer\'s bank statement:');
    console.log(buyerStatement);
    const buyerStatementRequest = this.postDocument(buyer.id, BANK_STATEMENT_TYPE, buyerStatement);


    // Seller bank statement
    const sellerStatementInfo = {
      $MessageID$: this.randomString(),
      $CompanyName$: seller.name,
      $CompanyID$: seller.id.toString(),
      $CompanyIBAN$: seller.iban,
      $OtherCompanyName$: buyer.name,
      $DateTimeNow$: nowISOString,
      $DateNow$: dateNowISOString,
      $SeqNumber$: this.randomNumberString(),
      $DateTimePurchaseFrom$: twoMinBeforeNowISOString,
      $DateTimePurchaseTo$: oneMinBeforeNowISOString,
      $TransactionType$: 'CRDT',
      $TotalDebit$: '0.00',
      $TotalCredit$: '' + purchase.totalPriceInclVat,
      $TotalPrice$: '' + purchase.totalPriceInclVat,
      $Currency$: seller.currency,
      $InvoiceID$: invoiceId,
      $PaymentReference$: paymentReference
    };

    const sellerStatement = populateTemplate(this.bankStatementTemplate, sellerStatementInfo);
    console.log('Sellers\'s bank statement:');
    console.log(sellerStatement);
    const sellerStatementRequest = this.postDocument(seller.id, BANK_STATEMENT_TYPE, sellerStatement);

    // TODO fill in all information in these templates
    // Depending on payment type, "document" is either an eInvoice or an eReceipt
    let buyerDocumentRequest;
    let sellerDocumentRequest;

    if (purchase.paidByCard) { // eReceipt

      const receiptInfo = {
        $CompanyName$: buyer.name,
        $CompanyID$: buyer.id.toString(),
        $CompanyVatID$: buyer.vatId,
        $CompanyCountry$: buyer.country,
        $OtherCompanyName$: seller.name,
        $OtherCompanyID$: seller.id.toString(),
        $OtherCompanyVatID$: seller.vatId,
        $OtherCompanyCountry$: seller.country,
        $InvoiceID$: invoiceId,
        $Currency$: seller.currency,
        $PriceExclVat$: purchase.totalPriceExclVat.toString().replace('.', ','),
        $VatPrice$: purchase.vatPrice.toString().replace('.', ','),
        $PriceInclVat$: purchase.totalPriceInclVat.toString().replace('.', ','),
      };

      const receipt = populateTemplate(this.eReceiptTemplate, receiptInfo);

      console.log('eReceipt:');
      console.log(receipt);

      buyerDocumentRequest = this.postDocument(buyer.id, RECEIPT_TYPE, receipt);
      sellerDocumentRequest = this.postDocument(seller.id, RECEIPT_TYPE, receipt);
    } else { // eInvoice

      const invoiceInfo = {
        $InvoiceID$: invoiceId
      };

      const invoice = populateTemplate(this.eInvoiceTemplate, invoiceInfo);

      console.log('eInvoice:');
      console.log(invoice);

      buyerDocumentRequest = this.postDocument(buyer.id, INVOICE_TYPE, invoice);
      sellerDocumentRequest = this.postDocument(seller.id, INVOICE_TYPE, invoice);
    }

    // TODO Include all requests when the documents are fully generated
    // return forkJoin([buyerStatementRequest, sellerStatementRequest, buyerDocumentRequest, sellerDocumentRequest]);
    return forkJoin([buyerStatementRequest, sellerStatementRequest);
  }

  private getTemplate(name: string, successAction) {
    this.http.get('assets/templates/' + name, { responseType: 'text' })
      .subscribe(successAction);
  }

  private randomString(): string {
    // Silly code I found for generating a random string, should probably be e.g. an UUID
    return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
  }

  private randomNumberString(): string {
    return '' + Math.floor(Math.random() * 9999);
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
