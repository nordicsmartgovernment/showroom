import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PurchasingComponent} from './dashboard/purchasing/purchasing.component';
import {LOAN_ROUTE, ORANGEBOOKS_ROUTE, PURCHASING_ROUTE} from './shared/routing.constants';
import {ShopsComponent} from './dashboard/purchasing/shops/shops.component';
import {ShopComponent} from './dashboard/purchasing/shop/shop.component';
import {OrangebooksComponent} from './dashboard/orangebooks/orangebooks.component';
import {LoanComponent} from './dashboard/loan/loan.component';


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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRouting {

}
