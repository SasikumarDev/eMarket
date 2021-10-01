import { Category, UOM, Product, ListingRouteParams } from './../../../../Shared/Models/model-context';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/Shared/Service/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { newGUID } from 'src/app/Shared/Utils/utils';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  drpCategory: Array<Category> = [];
  drpUom: Array<UOM> = [];
  Product: Product = <Product>{};
  QueryParms: ListingRouteParams = <ListingRouteParams>{};
  AllowedFileTypes: Array<string> = ['jpg'];
  ImageUrl: string = '';
  ProductImage!: File;

  constructor(private Service: SupabaseService, private Route: Router, private ActiveRoute: ActivatedRoute, private app: AppComponent) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.QueryParms = x as ListingRouteParams;
      console.log(this.QueryParms);
      this.FillDropDownData();
      if (Object.keys(this.QueryParms).length === 0) {
        this.Route.navigateByUrl('/');
      } else if (this.QueryParms.FormMode === 'E' && this.QueryParms.Keys) {
        this.Service.Show();
      } else if (this.QueryParms.FormMode === '') {
        this.Route.navigateByUrl('/');
      }
    });
  }

  HandleBack() {
    console.log(newGUID());
    if (this.QueryParms.Redirect) {
      this.Route.navigateByUrl(this.QueryParms.Redirect);
    } else {
      this.Route.navigateByUrl('/');
    }
  }

  async FillDropDownData(): Promise<void> {
    try {
      let Categoryies = await this.Service.SelectData('Category', 'CID,CDesc,CStatus');
      if (!Categoryies.error) {
        this.drpCategory = Categoryies.data as Array<Category>;
      }
      let UOMs = await this.Service.SelectData('UOM');
      if (!UOMs.error) {
        this.drpUom = UOMs.data as Array<UOM>;
      }
      console.log(this.drpUom);
    } catch (ex) {
      console.log(ex);
    }
  }

  OnFileChange(filelist: FileList) {
    this.ProductImage = filelist[0];
  }

}
