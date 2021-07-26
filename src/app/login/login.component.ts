import { Login } from './../Shared/Models/model-context';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginUser: Login = <Login>{};
  constructor() { }

  ngOnInit(): void {
  }

}
