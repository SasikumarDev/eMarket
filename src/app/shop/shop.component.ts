import { SupabaseService } from './../Shared/Service/supabase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  ResultData: any = [];
  Loading: boolean = false;
  constructor(private Service: SupabaseService) { }

  ngOnInit(): void {
    this.Loading = true;
    this.FillData();
  }

  async FillData(): Promise<void> {
    try {
      let reuslt = await this.Service.SelectData('Product', 'PrdId,PrdName,PrdPrice,PrdStock,PrdIsCustomisable,UOM:PrdUOM(UOMDesc),Category:PrdCat(CDesc),PrdImg');
      this.ResultData = reuslt.data;
      console.log(this.ResultData);
      this.Loading = false;
    } catch (ex) {
      this.Loading = false;
      console.log(ex);
    }
  }

  GetImagePath(Filename: string) {
    let imgurl = this.Service.GetImageURL(Filename);
    if (!imgurl.error && imgurl.publicURL) {
      return imgurl.publicURL;
    } else {
      return '';
    }
  }
}
