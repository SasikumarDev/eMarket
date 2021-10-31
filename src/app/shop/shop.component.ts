import { CartItems } from './../Shared/Models/model-context';
import { AppComponent } from 'src/app/app.component';
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
  constructor(private Service: SupabaseService, private app: AppComponent) { }

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
  AddCart(Product: any, Qty: any) {
  console.log(Qty);
    let cartitms: CartItems = <CartItems>{};
    cartitms.PrdId = Product.PrdId;
    cartitms.PrdImg = Product.PrdImg;
    cartitms.PrdName = Product.PrdName;
    cartitms.PrdPrice = Product.PrdPrice;
    cartitms.PrdQty = parseInt(Qty);
    cartitms.PrdUOM = Product.UOM.UOMDesc;
    let updindex = this.app.CartItems.findIndex(x => x.PrdId === Product.PrdId)
    if (updindex >= 0) {
      this.app.CartItems[updindex].PrdQty = this.app.CartItems[updindex].PrdQty + parseInt(Qty);
    } else {
      this.app.CartItems.push(cartitms);
    }
  }
}
