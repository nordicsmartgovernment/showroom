import {
  CASHFLOW_ROUTE,
  LOAN_ROUTE,
  ORANGEBOOKS_ROUTE,
  ORDERING_ROUTE,
  PURCHASING_ROUTE,
  SALES_ROUTE,
  WAREHOUSE_ROUTE
} from './routing.constants';

export interface Page {
  title: string;
  active: boolean;
  description?: string;
  route?: string;
}

export const PAGES: Page[] = [
  {title: 'Purchasing', active: true, description: 'eReceipt and eInvoice', route: PURCHASING_ROUTE},
  {title: 'Dashboard to financials', active: true, description: 'Dashboard to financials', route: ORANGEBOOKS_ROUTE},
  {title: 'Credit assessment', active: true , description: 'Apply for a loan', route: LOAN_ROUTE},
  {title: 'Warehouse management', active: true, description: 'Manage your wares', route: WAREHOUSE_ROUTE},
  {title: 'Supplier catalogues', active: true, route: ORDERING_ROUTE},
  {title: 'Sales', active: true, route: SALES_ROUTE},
  {title: 'Cashflow', active: true, route: CASHFLOW_ROUTE},
];
