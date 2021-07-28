import { SupabaseService } from './../Shared/Service/supabase.service';
import { Login } from './../Shared/Models/model-context';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginUser: Login = <Login>{};
  ShowLogin = true;
  errorMessage = '';
  ShowMailconfirmationAlert = false;
  constructor(private Service: SupabaseService) {
    console.log(this.Service.getCurrentUser());
   }

  async CreateUsers() {
    try {
      let CreateResponse = await this.Service.signUpUser(this.LoginUser);
      if (!CreateResponse.error) {
        this.ShowMailconfirmationAlert = true;
        console.log(CreateResponse.user);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  ShowCreate() {
    this.ShowLogin = this.ShowLogin === true ? false : true;
    console.log(this.ShowLogin)
  }
  async LoginUsers() {
    try {
      let LoginRes = await this.Service.LoginUser(this.LoginUser);
      if (LoginRes.error) {
        console.log(LoginRes.error);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  ngOnInit(): void {
  }

}
