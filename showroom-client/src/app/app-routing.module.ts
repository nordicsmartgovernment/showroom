import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PurchasingComponent } from './dashboard/purchasing/purchasing.component';
import { PURCHASING_ROUTE } from './shared/routing.constants';
import { ShopsComponent } from './dashboard/purchasing/shops/shops.component';
import { ShopComponent } from './dashboard/purchasing/shop/shop.component';


const routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: PURCHASING_ROUTE, component: PurchasingComponent, children: [
      { path: '', component: ShopsComponent },
      { path: ':id', component: ShopComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouting {

}
