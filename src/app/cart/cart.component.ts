import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void {
  }

}
