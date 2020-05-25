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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    PurchasingComponent,
    ShopComponent,
    ShopsComponent,
    OrderconfirmedComponent
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
    MatExpansionModule
  ],
  entryComponents: [
    OrderconfirmedComponent
  ],
  providers: [MatIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule {
}
