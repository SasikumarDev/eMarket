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
  ImageSelected: boolean = true;
  existsValidatorParams: Array<string> = [];

  constructor(private Service: SupabaseService, private Route: Router, private ActiveRoute: ActivatedRoute, private app: AppComponent) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.QueryParms = x as ListingRouteParams;
      this.FillDropDownData();
      if (Object.keys(this.QueryParms).length === 0) {
        this.Route.navigateByUrl('/');
      } else if (this.QueryParms.FormMode === 'E' && this.QueryParms.Keys) {
        this.Service.Show();
        this.GetEditData();
      } else if (this.QueryParms.FormMode === '') {
        this.Route.navigateByUrl('/');
      }
    });
  }

  HandleBack() {
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
        let resultData = Categoryies.data as Array<Category>;
        let mpData = resultData.map((data: Category) => {
          return {CID:data.CID,CDesc:data.CDesc,CStatus:!data.CStatus}
        });
        this.drpCategory = mpData as Array<Category>;
      }
      let UOMs = await this.Service.SelectData('UOM');
      if (!UOMs.error) {
        this.drpUom = UOMs.data as Array<UOM>;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  OnFileChange(filelist: FileList) {
    this.ProductImage = filelist[0];
  }

  HandleSubmit() {
    if (this.QueryParms.FormMode === 'A') {
      if (!this.ProductImage) {
        this.ImageSelected = false;
      } else {
        this.Service.Show();
        this.ImageSelected = true;
        this.SaveProduct();
      }
    } else {
      this.UpdateProduct();
    }
  }

  async SaveProduct(): Promise<void> {
    try {
      this.Product.PrdImg = 'P' + newGUID() + '.' + this.ProductImage.name.substring(this.ProductImage.name.indexOf('.') + 1);
      let ProductResponse = await this.Service.InsertData('Product', this.Product);
      if (!ProductResponse.error) {
        let uploadResponse = await this.Service.UploadProductImage(this.Product.PrdImg, this.ProductImage);
        if (!uploadResponse.error) {
          this.Service.Hide();
          this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Saved successfully ..' });
          this.HandleBack();
        }
      }
    } catch (ex) {
      console.log(ex);
      this.Service.Hide();
    }
  }

  async UpdateProduct(): Promise<void> {
    try {
      let oldImage = this.Product.PrdImg;
      if (this.ProductImage) {
        this.Product.PrdImg = 'P' + newGUID() + '.' + this.ProductImage.name.substring(this.ProductImage.name.indexOf('.') + 1);
      }
      let PrdUpdate = await this.Service.UpdateTable('Product', this.Product, { PrdId: this.Product.PrdId });
      if (!PrdUpdate.error) {
        this.Service.Hide();
        this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Updated successfully ..' });
        this.HandleBack();
      }
    } catch (ex) {
      this.Service.Hide();
      console.log(ex);
    }
  }

  async GetEditData(): Promise<void> {
    try {
      let ds = await this.Service.SelectDataEdit('Product', 'PrdId', this.QueryParms.Keys);
      if (!ds.error) {
        this.Product = ds.data[0] as Product;
        this.existsValidatorParams.push('PrdId');
        this.existsValidatorParams.push(this.Product.PrdId);
        if (this.Product.PrdImg) {
          let imgurl = this.Service.GetImageURL(this.Product.PrdImg);
          if (!imgurl.error && imgurl.publicURL) {
            this.ImageUrl = imgurl.publicURL;
          }
        }
      }
      this.Service.Hide();
    } catch (ex) {
      this.Service.Hide();
      console.log(ex);
    }
  }

}
