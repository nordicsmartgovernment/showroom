import { PURCHASING_ROUTE } from './routing.constants';

export interface Page {
  title: string;
  active: boolean;
  description?: string;
  route?: string;
}

export const PAGES: Page[] = [
  { title: 'Start a company', active: false },
  { title: 'Purchasing', active: true, description: 'eReceipt and eInvoice', route: PURCHASING_ROUTE },
  { title: 'Ordering', active: true },
  { title: 'Payroll', active: false },
  { title: 'Bookkeeping transactions', active: false },
  { title: 'Window to financials', active: false },
  { title: 'Warehouse management', active: false },
  { title: 'Sales', active: false },
  { title: 'Credit assessment', active: false },
  { title: 'Regulatory reporting', active: false },
  { title: 'Customer/supplier statistics', active: false }
];
