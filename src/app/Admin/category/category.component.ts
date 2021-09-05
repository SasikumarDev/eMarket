import { AppComponent } from './../../app.component';
import { Category, ListingRouteParams } from './../../Shared/Models/model-context';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/Shared/Service/supabase.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Category: Category = <Category>{};
  QueryParms: ListingRouteParams = <ListingRouteParams>{};
  AllowedFileTypes: Array<string> = ['jpg'];
  ProductImage!: File;
  existsValidatorParams: Array<string> = [];
  constructor(private Service: SupabaseService, private app: AppComponent, private Route: Router, private ActiveRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.QueryParms = x as ListingRouteParams;
      console.log(this.QueryParms);
      if (Object.keys(this.QueryParms).length === 0) {
        this.Route.navigateByUrl('/');
      } else if (this.QueryParms.FormMode === 'E' && this.QueryParms.Keys) {
        this.GetEditData();
      } else if(this.QueryParms.FormMode === '') {
        this.Route.navigateByUrl('/');
      }
    });
  }

  async SaveCategory(): Promise<void> {
    try {
      let CategoryPost = await this.Service.InsertData('Category', this.Category);
      if (!CategoryPost.error && this.ProductImage) {
        let savedPrd = CategoryPost.data as Category[];
        let FileName = savedPrd[0].CID + '.' + this.ProductImage.name.substring(this.ProductImage.name.indexOf('.') + 1);
        let FileUploadResult = await this.Service.UploadProductImage(FileName, this.ProductImage);
        if (!FileUploadResult.error) {
          let PrdUpdate = await this.Service.UpdateTable('Category', { CImgpath: FileName }, { CID: savedPrd[0].CID });
          if (!PrdUpdate.error) {
            this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Saved successfully ..' });
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  HandleBack() {
    if (this.QueryParms.Redirect) {
      this.Route.navigateByUrl(this.QueryParms.Redirect);
    } else {
      this.Route.navigateByUrl('/');
    }
  }

  OnFileChange(filelist: FileList) {
    this.ProductImage = filelist[0];
  }

  async GetEditData() {
    try {
      let ds = await this.Service.SelectDataEdit('Category', 'CID', this.QueryParms.Keys);
      if (!ds.error) {
        this.Category = ds.data[0] as Category;
        this.existsValidatorParams.push('CID');
        this.existsValidatorParams.push(this.Category.CID);
        if (this.Category.CImgpath) {
          let imgurl = this.Service.GetImageURL(this.Category.CImgpath);
          if (!imgurl.error && imgurl.publicURL) {
            this.Category.CImgpath = imgurl.publicURL;
          }
        }
      } else {

      }
    } catch (ex) {
      console.log(ex);
    }
  }

}
