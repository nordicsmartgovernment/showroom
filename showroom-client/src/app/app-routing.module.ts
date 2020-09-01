import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PurchasingComponent} from './dashboard/purchasing/purchasing.component';
import {
  CASHFLOW_ROUTE,
  LOAN_ROUTE,
  ORANGEBOOKS_ROUTE,
  ORDERING_ROUTE,
  PURCHASING_ROUTE,
  SALES_ROUTE,
  WAREHOUSE_ROUTE
} from './shared/routing.constants';
import {OrangebooksComponent} from './dashboard/orangebooks/orangebooks.component';
import {LoanComponent} from './dashboard/loan/loan.component';
import {WarehouseComponent} from './dashboard/warehouse/warehouse.component';
import {SoldComponent} from './dashboard/warehouse/sold/sold.component';
import {PurchasedComponent} from './dashboard/warehouse/purchased/purchased.component';
import {InventoryComponent} from './dashboard/warehouse/inventory/inventory.component';
import {OverviewComponent} from './dashboard/warehouse/overview/overview.component';
import {SalesComponent} from './dashboard/sales/sales.component';
import {PurchaseShopComponent} from './dashboard/purchasing/purchase-shop/purchase-shop.component';
import {PurchaseShopSelectionComponent} from './dashboard/purchasing/purchase-shop-selection/purchase-shop-selection.component';
import {OrderComponent} from './dashboard/ordering/order.component';
import {SalesOverviewComponent} from './dashboard/sales/sales-overview/sales-overview.component';
import {CashflowComponent} from './dashboard/cashflow/cashflow.component';


const routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {
    path: PURCHASING_ROUTE, component: PurchasingComponent, children: [
      {path: '', component: PurchaseShopSelectionComponent},
      {path: ':id', component: PurchaseShopComponent}
    ]
  },
  {path: ORANGEBOOKS_ROUTE, component: OrangebooksComponent},
  {path: LOAN_ROUTE, component: LoanComponent},
  {path: SALES_ROUTE, component: SalesComponent, children: [
      {path: '', component: SalesOverviewComponent},
    ]},
  {path: ORDERING_ROUTE, component: OrderComponent},
  {path: CASHFLOW_ROUTE, component: CashflowComponent},
  {
    path: WAREHOUSE_ROUTE, component: WarehouseComponent,
    children: [
      {path: '', component: OverviewComponent},
      {path: 'sold', component: SoldComponent},
      {path: 'purchased', component: PurchasedComponent},
      {path: 'inventory', component: InventoryComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRouting {

}
