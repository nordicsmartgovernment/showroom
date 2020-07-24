import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Company} from './company.service';
import {Product, Store} from './store.model';
import {forkJoin, Observable} from 'rxjs';
import {j2xParser as ObjToXmlParser, parse} from 'fast-xml-parser';
import {EInvoice} from './xmlmodels/eInvoice/eInvoice.model';
import {EReceipt} from './xmlmodels/eReceipt/e-receipt.model';


const SANDBOX_URL = 'https://nsg.fellesdatakatalog.brreg.no/';
const DOCUMENTS_PATH = 'document/';
const BANK_STATEMENT_TYPE = 'application/vnd.nordicsmartgovernment.bank-statement';
const RECEIPT_TYPE = 'application/vnd.nordicsmartgovernment.receipt';
const PURCHASE_INVOICE_TYPE = 'application/vnd.nordicsmartgovernment.purchase-invoice';
const SALES_INVOICE_TYPE = 'application/vnd.nordicsmartgovernment.sales-invoice';


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
  private eReceiptTemplate: string;
  private readonly xmlWriterOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '__',
    textNodeName: '_text_',
    type: EInvoice
  };
  private readonly xmlReaderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '__',
    textNodeName: '_text_',
    type: EInvoice,
    parseAttributeValue: true,
  };

  constructor(private http: HttpClient) {
    this.getTemplate('bankStatementTemplate.xml', template => this.bankStatementTemplate = template);


    this.getTemplate('finvoice_eReceiptTemplate.xml', template => this.eReceiptTemplate = template);
  }

  private static randomNumberString(): string {
    return '' + Math.floor(Math.random() * 9999);
  }

  postDocument(companyId: number, documentType: string, payload: string) {
    return this.http.post(SANDBOX_URL + DOCUMENTS_PATH + companyId, payload, {
      headers: new HttpHeaders({'Content-Type': documentType})
    });
  }

  submitLoan(loanRecipient: Company, loanAmount: number, bankName: string) {
    const invoiceId = this.randomString();
    const paymentReference = this.randomString();
    const now = new Date();
    const nowISOString = now.toISOString();
    const twoMinBeforeNowISOString = new Date(now.getTime() - 120000).toISOString();
    const oneMinBeforeNowISOString = new Date(now.getTime() - 60000).toISOString();
    const dateNowISOString = nowISOString.substr(0, 10);

    const loanRecipientInfo = {
      $MessageID$: this.randomString(),
      $CompanyName$: loanRecipient.name,
      $CompanyID$: loanRecipient.id.toString(),
      $CompanyIBAN$: loanRecipient.iban,
      $OtherCompanyName$: bankName,
      $DateTimeNow$: nowISOString,
      $DateNow$: dateNowISOString,
      $SeqNumber$: SandboxService.randomNumberString(),
      $DateTimePurchaseFrom$: twoMinBeforeNowISOString,
      $DateTimePurchaseTo$: oneMinBeforeNowISOString,
      $TransactionType$: 'CRDT',
      $TotalDebit$: '0.00',
      $TotalCredit$: '' + loanAmount,
      $TotalPrice$: '' + loanAmount,
      $Currency$: 'EUR',
      $InvoiceID$: invoiceId,
      $PaymentReference$: paymentReference
    };

    const buyerStatement = populateTemplate(this.bankStatementTemplate, loanRecipientInfo);
    console.log('Loan recipients bank statement:');
    console.log(buyerStatement);
    return this.postDocument(loanRecipient.id, BANK_STATEMENT_TYPE, buyerStatement);
  }

  submitPurchase(purchase: PurchaseDescription, product: Product, buyer: Company, seller: Store): Observable<any[]> {
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
      $SeqNumber$: SandboxService.randomNumberString(),
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
      $SeqNumber$: SandboxService.randomNumberString(),
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

    let buyerDocumentRequest;
    let sellerDocumentRequest;

    // TODO fill in all information in these templates
    // Depending on payment type, "document" is either an eInvoice or an eReceipt
    if (purchase.paidByCard) { // eReceipt

      const eReceipt = new EReceipt();
      const eReceiptModel = eReceipt.Finvoice;
      eReceiptModel.generate(purchase, product, seller, paymentReference, invoiceId, buyer);
      const eReceiptXmlString = this.objectToXml(eReceipt);

      console.log('eReceipt:');
      console.log(eReceiptXmlString);

      buyerDocumentRequest = this.postDocument(buyer.id, RECEIPT_TYPE, eReceiptXmlString);
      sellerDocumentRequest = this.postDocument(seller.id, RECEIPT_TYPE, eReceiptXmlString);
    } else { // eInvoice
      const finvoice = new EInvoice();
      const eInvoiceModel = finvoice.Finvoice;
      eInvoiceModel.generate(purchase, product, seller, paymentReference, invoiceId, buyer);
      const eInvoiceXmlString = this.objectToXml(finvoice);

      console.log('eInvoice:');
      console.log(eInvoiceXmlString);


      buyerDocumentRequest = this.postDocument(buyer.id, PURCHASE_INVOICE_TYPE, eInvoiceXmlString);
      sellerDocumentRequest = this.postDocument(seller.id, SALES_INVOICE_TYPE, eInvoiceXmlString);
    }

    // TODO Include all requests when the documents are fully generated
    // return forkJoin([buyerStatementRequest, sellerStatementRequest, buyerDocumentRequest, sellerDocumentRequest]);
    return forkJoin([buyerStatementRequest, sellerStatementRequest, buyerDocumentRequest, sellerDocumentRequest]);
  }

  private objectToXml(eInvoiceModel: any): string {
    return new ObjToXmlParser(this.xmlWriterOptions)
      .parse(eInvoiceModel);
  }

  private xmlToObject(xmlString: string): any {
    return (parse(xmlString, this.xmlReaderOptions, true) as EInvoice);
  }

  private getTemplate(name: string, successAction) {
    this.http.get('assets/templates/' + name, {responseType: 'text'})
      .subscribe(successAction);
  }

  private randomString(): string {
    // Silly code I found for generating a random string, should probably be e.g. an UUID
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
