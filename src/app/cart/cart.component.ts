import { SupabaseService } from 'src/app/Shared/Service/supabase.service';
import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';
import { CartItems } from '../Shared/Models/model-context';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  CartItems: Array<CartItems> = [];
  constructor(public appComponent: AppComponent, private Service: SupabaseService) { }

  ngOnInit(): void {
    this.CartItems = this.appComponent.CartItems;
  }

  GetImageURL(filename: string): string {
    let imgurl = this.Service.GetImageURL(filename);
    if (!imgurl.error && imgurl.publicURL) {
      return imgurl.publicURL;
    } else {
      return '';
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

  getPrice(qty: number,price: number){
    return qty*price;
  }

}
