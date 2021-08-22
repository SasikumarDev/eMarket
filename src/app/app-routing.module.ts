import { CartComponent } from './cart/cart.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { RoleGuard } from './Shared/Auth/role.guard';
import { ProductComponent } from './Admin/Masters/Product/product/product.component';
import { CategoryComponent } from './Admin/category/category.component';

const routes: Routes = [
  { path: 'Cart', component: CartComponent },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'A' } },
  { path: 'Product', component: ProductComponent, canActivate: [RoleGuard], data: { role: 'A' } },
  { path: 'Category', component: CategoryComponent, canActivate: [RoleGuard], data: { role: 'A' } },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
