import {LOAN_ROUTE, ORANGEBOOKS_ROUTE, PURCHASING_ROUTE, WAREHOUSE_ROUTE} from './routing.constants';

export interface Page {
  title: string;
  active: boolean;
  description?: string;
  route?: string;
}

export const PAGES: Page[] = [
  {title: 'Purchasing', active: true, description: 'eReceipt and eInvoice', route: PURCHASING_ROUTE},
  {title: 'Window to financials', active: true, description: 'Window to financials', route: ORANGEBOOKS_ROUTE},
  {title: 'Credit assessment', active: true , description: 'Apply for a loan', route: LOAN_ROUTE},
  {title: 'Warehouse management', active: true, description: 'Manage your wares', route: WAREHOUSE_ROUTE},
  {title: 'Ordering', active: false},
  {title: 'Payroll', active: false},
  {title: 'Bookkeeping transactions', active: false},
  {title: 'Sales', active: false},
  {title: 'Regulatory reporting', active: false},
  {title: 'Customer/supplier statistics', active: false}
];
