import { AppComponent } from './../../app.component';
import { Category, ListingRouteParams } from './../../Shared/Models/model-context';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/Shared/Service/supabase.service';
import { newGUID } from 'src/app/Shared/Utils/utils';
import { Form, NgForm } from '@angular/forms';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Category: Category = <Category>{};
  QueryParms: ListingRouteParams = <ListingRouteParams>{};
  AllowedFileTypes: Array<string> = ['jpg'];
  ImageUrl: string = '';
  ProductImage!: File;
  ImageSelected: boolean = true;
  existsValidatorParams: Array<string> = [];
  constructor(private Service: SupabaseService, private app: AppComponent, private Route: Router, private ActiveRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.QueryParms = x as ListingRouteParams;
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
  HandleSubmitClck() {
    if (this.QueryParms.FormMode === 'A') {
      if (!this.ProductImage) {
        this.ImageSelected = false;
      } else {
        this.ImageSelected = true;
        this.SaveCategory();
      }
    } else {
      this.UpdateCategory();
    }
  }
  async SaveCategory(): Promise<void> {
    try {
      this.Category.CImgpath = 'C' + newGUID() + '.' + this.ProductImage.name.substring(this.ProductImage.name.indexOf('.') + 1);
      let CategoryPost = await this.Service.InsertData('Category', this.Category);
      if (!CategoryPost.error && this.ProductImage) {
        let FileUploadResult = await this.Service.UploadProductImage(this.Category.CImgpath, this.ProductImage);
        if (!FileUploadResult.error) {
          this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Saved successfully ..' });
          this.HandleBack();
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async UpdateCategory(): Promise<void> {
    try {
      let PrdUpdate = await this.Service.UpdateTable('Category', this.Category, { CID: this.Category.CID });
      if (!PrdUpdate.error) {
        this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Updated successfully ..' });
        this.HandleBack();
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

  GetPopupConfirmation() {
    this.app.ConfirmPopup.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleDelete();
      },
      reject: () => {
      }
    });
  }

  async handleDelete(): Promise<void> {
    try {
      let delete_rslt = await this.Service.DeleteData('Category', { CID: this.Category.CID });
      if (!delete_rslt.error) {
        this.app.ToastMsg.add({ severity: 'success', summary: 'success', detail: 'Deleted successfully ..' });
        this.HandleBack();
      }
    } catch (ex) {

    }
  }
}
