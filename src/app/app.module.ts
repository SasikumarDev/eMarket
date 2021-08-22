import { SupabaseService } from './Shared/Service/supabase.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProductListingComponent } from './Admin/Masters/Product/product-listing/product-listing.component';
import { ProductComponent } from './Admin/Masters/Product/product/product.component';
import { CategoryComponent } from './Admin/category/category.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    DashboardComponent,
    ProductListingComponent,
    ProductComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule,
    DialogModule,
    BadgeModule,
    AvatarModule,
    MenuModule,
    SidebarModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    SupabaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
