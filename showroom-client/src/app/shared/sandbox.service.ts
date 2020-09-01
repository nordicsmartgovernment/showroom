import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Company, CompanyService} from './company.service';
import {Product} from './store.model';
import {forkJoin, Observable} from 'rxjs';
import {j2xParser as ObjToXmlParser, parse} from 'fast-xml-parser';
import {EInvoice, EInvoiceModel} from './xmlmodels/eInvoice/eInvoice.model';
import {EReceipt} from './xmlmodels/eReceipt/e-receipt.model';
import {map} from 'rxjs/operators';
import {InventoryProduct} from './inventory.model';
import {orderLineToCalc, priceExcludingVAT, priceIncludingVAT, round} from './utils/vatUtil';
import {StoreService} from './store.service';
import {Order} from '../dashboard/ordering/order.component';
import {CurrencyService} from './currency.service';


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

export interface PurchaseDetails {
  productId: number;
  unitPrice: number;
  amount: number;
  sellerId: number;
  totalPriceExclVat: number;
  totalPriceInclVat: number;
  vatRate: number;
  currency: string;
  quantityCode: string;
  productName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SandboxService {
  private bankStatementTemplate: string;
  private bankLoanStatementTemplate: string;
  private eReceiptTemplate: string;
  private readonly xmlWriterOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '__',
    textNodeName: '_text_',
    format: true,
  };
  private readonly xmlReaderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '__',
    textNodeName: '_text_',
    parseAttributeValue: true,
  };

  constructor(private http: HttpClient,
              private storeService: StoreService,
              private currencyService: CurrencyService,
              private companyService: CompanyService) {
    this.getTemplate('bankStatementPurchaseTemplate.xml', template => this.bankStatementTemplate = template);
    this.getTemplate('bankStatementLoanTemplate.xml', template => this.bankLoanStatementTemplate = template);
    this.getTemplate('finvoice_eReceiptTemplate.xml', template => this.eReceiptTemplate = template);
  }

  private static randomNumberString(): string {
    return '' + Math.floor(Math.random() * 9999);
  }

  private static getDocumentStrings(documents: ArrayBuffer) {
    const documentXml = new TextDecoder('utf-8').decode(documents);

    const parsed = parse(documentXml);
    let items = [];
    if (parsed.ArrayList === null || parsed.ArrayList.item === null) {
      return [];
    }

    if (typeof parsed.ArrayList.item[Symbol.iterator] === 'function') {
      items = parsed.ArrayList.item;
    } else {
      items.push(parsed.ArrayList.item);
    }
    return items;
  }

  private static filterValidProduct(product: InventoryProduct) {
    return product &&
      product.amountUnit &&
      product.amount &&
      product.amount >= 0 &&
      product.price &&
      product.price >= 0;
  }

  private static mapFromInvoiceToInventoryProduct(finvoice: EInvoiceModel) {
    const inventoryProduct = new InventoryProduct(
      finvoice.InvoiceRow.ArticleName,
      finvoice.InvoiceRow.DeliveredQuantity._text_,
      finvoice.InvoiceRow.DeliveredQuantity.__QuantityUnitCode,
      finvoice.InvoiceDetails.InvoiceTotalVatIncludedAmount._text_,
      finvoice.InvoiceDetails.InvoiceTotalVatIncludedAmount.__AmountCurrencyIdentifier,
      finvoice.InvoiceDetails.PaymentTermsDetails.InvoiceDueDate._text_
    );
    inventoryProduct.setInvoiceId(finvoice.InvoiceDetails.InvoiceNumber);
    return inventoryProduct;
  }

  private static mapFromReceiptToInventoryProduct(receipt: EReceipt) {
    const invoiceRow = receipt.Finvoice.InvoiceRow.filter(row => row.ArticleName !== null)[0];
    const inventoryProduct = new InventoryProduct(
      invoiceRow.ArticleName,
      invoiceRow.DeliveredQuantity._text_,
      invoiceRow.DeliveredQuantity.__QuantityUnitCode,
      receipt.Finvoice.InvoiceDetails.InvoiceTotalVatIncludedAmount._text_,
      receipt.Finvoice.InvoiceDetails.InvoiceTotalVatIncludedAmount.__AmountCurrencyIdentifier,
      receipt.Finvoice.InvoiceDetails.InvoiceDate._text_
    );
    inventoryProduct.setInvoiceId(receipt.Finvoice.InvoiceDetails.InvoiceNumber);
    return inventoryProduct;
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

    const buyerStatement = populateTemplate(this.bankLoanStatementTemplate, loanRecipientInfo);
    console.log('Loan recipients bank statement:');
    console.log(buyerStatement);
    return this.postDocument(loanRecipient.id, BANK_STATEMENT_TYPE, buyerStatement);
  }

  submitMultiOrderLinesPurchase(order: Order, paidByCard: boolean = false): Observable<any[]> {
    const buyer = this.companyService.getCompany(order.buyer);
    const subscriptions = [];
    for (const orderLine of order.orderLines) {
      const seller = this.companyService.getCompany(order.seller);
      const priceInclVat = priceIncludingVAT(orderLineToCalc(orderLine), buyer.country, seller.country);
      subscriptions.push(this.submitPurchase({
        paidByCard,
        totalPriceExclVat: priceExcludingVAT(orderLineToCalc(orderLine)),
        vatPrice: round(priceInclVat - priceExcludingVAT(orderLineToCalc(orderLine))),
        totalPriceInclVat: priceInclVat,
        amount: orderLine.amount
      }, orderLine.product, buyer, seller));
    }
    return forkJoin(...subscriptions);
  }

  async getPurchaseItemsForActingCompany() {
    const invoicePurchases =
      await this.getAndMapInvoice(PURCHASE_INVOICE_TYPE, SandboxService.mapFromInvoiceToInventoryProduct).toPromise();
    const receiptPurchases =
      await this.getAndMapReceipt(true, SandboxService.mapFromReceiptToInventoryProduct).toPromise();

    // Filter out weird purchases
    return invoicePurchases.concat(receiptPurchases)
      .filter(purchase => {
        return SandboxService.filterValidProduct(purchase);
      });
  }

  async getPurchaseDetailsForActingCompany(): Promise<PurchaseDetails[]> {
    let mapInvoice: (eInvoice: EInvoiceModel) => PurchaseDetails;
    mapInvoice = finvoice => {
      return {
        amount: finvoice.InvoiceRow.OrderedQuantity._text_,
        sellerId: +finvoice.SellerPartyDetails.SellerPartyIdentifier,
        totalPriceExclVat: finvoice.InvoiceRow.RowVatExcludedAmount._text_,
        totalPriceInclVat: finvoice.InvoiceRow.RowAmount._text_,
        vatRate: +finvoice.InvoiceDetails.VatSpecificationDetails.VatRatePercent,
        currency: finvoice.InvoiceRow.RowVatExcludedAmount.__AmountCurrencyIdentifier,
        quantityCode: finvoice.InvoiceRow.OrderedQuantity.__QuantityUnitCode,
        productName: finvoice.InvoiceRow.ArticleName,
        unitPrice: finvoice.InvoiceRow.UnitPriceAmount._text_,
        productId: +finvoice.InvoiceRow.EanCode
      };
    };

    let mapReceipt: (eReceipt: EReceipt) => PurchaseDetails;
    mapReceipt = finvoice => {
      const invoiceRow = finvoice.Finvoice.InvoiceRow.filter(row => row.ArticleName !== null)[0];
      return {
        amount: invoiceRow.OrderedQuantity._text_,
        sellerId: +finvoice.Finvoice.SellerPartyDetails.SellerPartyIdentifier,
        totalPriceExclVat: invoiceRow.RowVatExcludedAmount._text_,
        totalPriceInclVat: invoiceRow.RowAmount._text_,
        vatRate: +finvoice.Finvoice.InvoiceDetails.VatSpecificationDetails.VatRatePercent,
        currency: invoiceRow.RowVatExcludedAmount.__AmountCurrencyIdentifier,
        quantityCode: invoiceRow.OrderedQuantity.__QuantityUnitCode,
        productName: invoiceRow.ArticleName,
        unitPrice: invoiceRow.UnitPriceAmount._text_,
        productId: +invoiceRow.EanCode
      };
    };

    const invoicePurchases = await this.getAndMapInvoice(PURCHASE_INVOICE_TYPE, mapInvoice).toPromise();
    const receiptPurchases = await this.getAndMapReceipt(true, mapReceipt).toPromise();
    return invoicePurchases.concat(receiptPurchases);
  }

  getBusinessDocuments(documentType: string) {
    const actingCompanyId = this.companyService.getActingCompany().id;
    return this.http
      .get(SANDBOX_URL + DOCUMENTS_PATH + actingCompanyId, {
        responseType: 'arraybuffer',
        params: new HttpParams()
          .set('companyId', '' + actingCompanyId)
          .set('documentTypes', '' + documentType),
        headers: new HttpHeaders()
          .set('accept', 'application/xml')
      });
  }

  async getSalesForActingCompany() {
    const invoiceSales
      = await this.getAndMapInvoice(SALES_INVOICE_TYPE, SandboxService.mapFromInvoiceToInventoryProduct).toPromise();
    const receiptSales =
      await this.getAndMapReceipt(false, SandboxService.mapFromReceiptToInventoryProduct).toPromise();

    // Filter out weird purchases
    return invoiceSales.concat(receiptSales)
      .filter(sale => {
        return SandboxService.filterValidProduct(sale);
      });
  }

  private submitPurchase(purchase: PurchaseDescription, product: Product, buyer: Company, seller: Company): Observable<any[]> {
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
    const sellerCurrency = this.currencyService.getCurrency(seller.country);


    // Buyer bank statement
    const totalPriceInclVatBuyer = this.currencyService
      .convertCurrency(purchase.totalPriceInclVat, seller.country, buyer.country);
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
      $TotalDebit$: '' + totalPriceInclVatBuyer,
      $TotalCredit$: '0.00',
      $TotalPrice$: '' + totalPriceInclVatBuyer,
      $Currency$: this.currencyService.getCurrency(buyer.country),
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
      $Currency$: this.currencyService.getCurrency(seller.country),
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
      eReceiptModel.generate(purchase, product, seller, paymentReference, invoiceId, buyer, sellerCurrency);
      const eReceiptXmlString = this.objectToXml(eReceipt);

      console.log('eReceipt:');
      console.log(eReceiptXmlString);

      buyerDocumentRequest = this.postDocument(buyer.id, RECEIPT_TYPE, eReceiptXmlString);
      sellerDocumentRequest = this.postDocument(seller.id, RECEIPT_TYPE, eReceiptXmlString);
    } else { // eInvoice
      const finvoice = new EInvoice();
      const eInvoiceModel = finvoice.Finvoice;
      eInvoiceModel.generate(purchase, product, seller, paymentReference, invoiceId, buyer, sellerCurrency);
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

  private getAndMapInvoice<T>(
    documentType: string,
    mappingFunction: (finvoice: EInvoiceModel) => T): Observable<T[]> {

    return this.getBusinessDocuments(documentType)
      .pipe(
        map(documents => {
          const mappedItems: T[] = [];
          if (!documents) {
            return mappedItems;
          }

          const items = SandboxService.getDocumentStrings(documents);
          for (const item of items) {
            const xmlString = atob(item.original);
            const purchaseInvoice = parse(xmlString, this.xmlReaderOptions) as EInvoice;
            const finvoice = purchaseInvoice.Finvoice;
            const mappedItem = mappingFunction(finvoice);
            mappedItems.push(mappedItem);
          }
          return mappedItems;
        })
      );
  }

  private objectToXml(eInvoiceModel: any): string {
    return new ObjToXmlParser(this.xmlWriterOptions)
      .parse(eInvoiceModel);
  }

  private getTemplate(name: string, successAction) {
    this.http.get('assets/templates/' + name, {responseType: 'text'})
      .subscribe(successAction);
  }

  private randomString(): string {
    // Silly code I found for generating a random string, should probably be e.g. an UUID
    return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
  }

  private getAndMapReceipt<T>(
    isBuyer: boolean,
    mappingFunction: (finvoice: EReceipt) => T): Observable<T[]> {

    return this.getBusinessDocuments(RECEIPT_TYPE)
      .pipe(
        map(documents => {
          const mappedItems: T[] = [];
          if (!documents) {
            return mappedItems;
          }

          const items = SandboxService.getDocumentStrings(documents);
          for (const item of items) {
            const xmlString = atob(item.original);
            const receipt = parse(xmlString, this.xmlReaderOptions) as EReceipt;

            if (isBuyer && this.isBuyer(receipt) || !isBuyer && this.isSeller(receipt)) {
              const inventoryProduct = mappingFunction(receipt);

              mappedItems.push(inventoryProduct);
            }
          }
          return mappedItems;
        })
      );

  }

  private isBuyer(receipt: EReceipt) {
    return receipt.Finvoice.BuyerPartyDetails.BuyerPartyIdentifier.toString()
      === this.companyService.getActingCompany().id.toString();
  }

  private isSeller(receipt: EReceipt) {
    return receipt.Finvoice.SellerPartyDetails.SellerPartyIdentifier.toString()
      === this.companyService.getActingCompany().id.toString();
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
