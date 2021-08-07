import { SupabaseService } from './Shared/Service/supabase.service';
import { Login } from './Shared/Models/model-context';
import { Component, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '@supabase/supabase-js';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appName = environment.companyName;
  appMotto = environment.companyMotto;
  appIcon = environment.companyIconPath;
  isUserAuth = false;
  displayLogin = false;
  LoginUser: Login = <Login>{};
  IsLogin = true;
  PopupTitle: string = 'Login';
  LoggedUser: User = <User>{}; // to store current loged user
  EventUserLogged: EventEmitter<boolean> = new EventEmitter();
  UserMenuitems: MenuItem[];
  DisplaySideNav: boolean = false;

  constructor(private Service: SupabaseService) {
    this.CheckUserLoggedin();
     this.UserMenuitems = [{
            items: [{
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    this.update();
                }
            },
            {
                label: 'Sign Out',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.LogOutUser();
                }
            }
            ]}
        ];
  }
  
  update(): void {
   console.log('Test Update');
  }
  
  delete(): void {
   console.log('Test Delete');
  }

  LoginDialog() {
    this.displayLogin = true;
  }
  LoginCreateacc(): void {
    this.IsLogin = this.IsLogin === true ? false : true;
    this.PopupTitle = this.IsLogin === true ? 'Login' : 'SignUp';
    this.LoginUser = <Login>{};
  }
  async LoginAccount() {
    try {
      if (this.IsLogin) {
        let LoginResult = await this.Service.LoginUser(this.LoginUser);
        console.log(LoginResult);
        this.setToken(LoginResult);
        this.displayLogin = false;
        this.CheckUserLoggedin();
      } else {
        let CreateUserResult = await this.Service.signUpUser(this.LoginUser);
        console.log(CreateUserResult);
        this.setToken(CreateUserResult);
        this.CheckUserLoggedin();
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  setToken(response: any) {
    if (response.data.confirmation_sent_at && !response.data.access_token) {
      alert('Confirmation Email Sent')
    } else {
      console.log(response.user.email);
    }
  }
  CheckUserLoggedin() {
    try {
      let loguser = this.Service.getCurrentUser();
      console.log(loguser);
      if (loguser) {
        this.LoggedUser = loguser;
        this.isUserAuth = true;
        this.EventUserLogged.emit(this.isUserAuth);
      } else {
      this.isUserAuth = false;
      this.EventUserLogged.emit(this.isUserAuth);
      }
    }
    catch (ex) {
      this.isUserAuth = false;
      this.EventUserLogged.emit(this.isUserAuth);
      console.log(ex);
    }
  }
  
  LogOutUser() {
   try {
   let rslt = this.Service.LogOutUser();
   console.log(rslt);
   this.CheckUserLoggedin();
   } catch(ex){
   console.log(ex);
   }
  }
}
