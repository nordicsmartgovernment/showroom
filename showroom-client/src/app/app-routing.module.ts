import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PurchasingComponent} from './dashboard/purchasing/purchasing.component';
import {
  LOAN_ROUTE,
  ORANGEBOOKS_ROUTE,
  ORDERING_ROUTE,
  PURCHASING_ROUTE,
  SALES_ROUTE,
  WAREHOUSE_ROUTE
} from './shared/routing.constants';
import {ShopsComponent} from './dashboard/purchasing/shops/shops.component';
import {ShopComponent} from './dashboard/purchasing/shop/shop.component';
import {OrangebooksComponent} from './dashboard/orangebooks/orangebooks.component';
import {LoanComponent} from './dashboard/loan/loan.component';
import {WarehouseComponent} from './dashboard/warehouse/warehouse.component';
import {SoldComponent} from './dashboard/warehouse/sold/sold.component';
import {PurchasedComponent} from './dashboard/warehouse/purchased/purchased.component';
import {InventoryComponent} from './dashboard/warehouse/inventory/inventory.component';
import {OverviewComponent} from './dashboard/warehouse/overview/overview.component';
import {SalesComponent} from './dashboard/sales/sales.component';
import {OrderingComponent} from './dashboard/ordering/ordering.component';
import {OrderShopComponent} from './dashboard/ordering/order-shop/order-shop.component';
import {OrderShopSelectionComponent} from './dashboard/ordering/order-shop-selection/order-shop-selection.component';


const routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {
    path: PURCHASING_ROUTE, component: PurchasingComponent, children: [
      {path: '', component: ShopsComponent},
      {path: ':id', component: ShopComponent}
    ]
  },
  {path: ORANGEBOOKS_ROUTE, component: OrangebooksComponent},
  {path: LOAN_ROUTE, component: LoanComponent},
  {path: SALES_ROUTE, component: SalesComponent},
  {
    path: ORDERING_ROUTE, component: OrderingComponent, children: [
      {path: '', component: OrderShopSelectionComponent},
      {path: ':id', component: OrderShopComponent},
    ]
  },
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
