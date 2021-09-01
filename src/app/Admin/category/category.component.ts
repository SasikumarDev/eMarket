import { AppComponent } from './../../app.component';
import { Category } from './../../Shared/Models/model-context';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/Shared/Service/supabase.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Category: Category = <Category>{};
  FormMode: string = 'A';
  AllowedFileTypes: Array<string> = ['jpg'];
  ProductImage!: File;
  constructor(private Service: SupabaseService, private app: AppComponent) { }

  ngOnInit(): void {
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

  OnFileChange(filelist: FileList) {
    this.ProductImage = filelist[0];
  }

}
