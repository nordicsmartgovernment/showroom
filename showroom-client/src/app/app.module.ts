import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HeaderComponent} from './header/header.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppRouting} from './app-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PurchasingComponent} from './dashboard/purchasing/purchasing.component';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OrangebooksComponent} from './dashboard/orangebooks/orangebooks.component';
import {LoanComponent} from './dashboard/loan/loan.component';
import {WarehouseComponent} from './dashboard/warehouse/warehouse.component';
import {PurchasedComponent} from './dashboard/warehouse/purchased/purchased.component';
import {SoldComponent} from './dashboard/warehouse/sold/sold.component';
import {InventoryComponent} from './dashboard/warehouse/inventory/inventory.component';
import {OverviewComponent} from './dashboard/warehouse/overview/overview.component';
import {SalesComponent} from './dashboard/sales/sales.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {OrderComponent} from './dashboard/ordering/order.component';
import {PurchaseShopComponent} from './dashboard/purchasing/purchase-shop/purchase-shop.component';
import {PurchaseShopSelectionComponent} from './dashboard/purchasing/purchase-shop-selection/purchase-shop-selection.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SalesOverviewComponent } from './dashboard/sales/sales-overview/sales-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    PurchasingComponent,
    OrangebooksComponent,
    LoanComponent,
    WarehouseComponent,
    PurchasedComponent,
    SoldComponent,
    InventoryComponent,
    OverviewComponent,
    SalesComponent,
    OrderComponent,
    PurchaseShopComponent,
    PurchaseShopSelectionComponent,
    SalesOverviewComponent,
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
    ScrollingModule,
    MatTreeModule,
    MatTableModule,
    MatSelectModule,
    DragDropModule
  ],
  entryComponents: [],
  providers: [MatIconRegistry, MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule {
}
