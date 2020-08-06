import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRouting } from './app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PurchasingComponent } from './dashboard/purchasing/purchasing.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ShopComponent } from './dashboard/purchasing/shop/shop.component';
import { ShopsComponent } from './dashboard/purchasing/shops/shops.component';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { OrderconfirmedComponent } from './dashboard/purchasing/shop/orderconfirmed/orderconfirmed.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrangebooksComponent } from './dashboard/orangebooks/orangebooks.component';
import { LoanComponent } from './dashboard/loan/loan.component';
import { WarehouseComponent } from './dashboard/warehouse/warehouse.component';
import { PurchasedComponent } from './dashboard/warehouse/purchased/purchased.component';
import { SoldComponent } from './dashboard/warehouse/sold/sold.component';
import { InventoryComponent } from './dashboard/warehouse/inventory/inventory.component';
import { OverviewComponent } from './dashboard/warehouse/overview/overview.component';
import { SalesComponent } from './dashboard/sales/sales.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { OrderingComponent } from './dashboard/ordering/ordering.component';
import { OrderShopComponent } from './dashboard/ordering/order-shop/order-shop.component';
import { OrderShopSelectionComponent } from './dashboard/ordering/order-shop-selection/order-shop-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    PurchasingComponent,
    ShopComponent,
    ShopsComponent,
    OrderconfirmedComponent,
    OrangebooksComponent,
    LoanComponent,
    WarehouseComponent,
    PurchasedComponent,
    SoldComponent,
    InventoryComponent,
    OverviewComponent,
    SalesComponent,
    OrderingComponent,
    OrderShopComponent,
    OrderShopSelectionComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AppRouting,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ],
  entryComponents: [
    OrderconfirmedComponent
  ],
  providers: [MatIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule {
}
