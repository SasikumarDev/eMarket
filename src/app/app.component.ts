import { Router } from '@angular/router';
import { SupabaseService } from './Shared/Service/supabase.service';
import { Login } from './Shared/Models/model-context';
import { Component, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '@supabase/supabase-js';
import { MenuItem } from 'primeng/api';
import { SwUpdate } from '@angular/service-worker';

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
  ErrorMessage = '';
  UserRole: string = '';

  constructor(public Service: SupabaseService, private Route: Router, private swupdate: SwUpdate) {
    this.swupdate.available.subscribe(event => {
      this.swupdate.activateUpdate().then(() => document.location.reload());
    });
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
      ]
    }
    ];
  }

  update(): void {
    console.log('Test Update');
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
    this.Service.Show();
    try {
      if (this.IsLogin) {
        let LoginResult = await this.Service.LoginUser(this.LoginUser);
        if (!LoginResult.error) {
          this.setToken(LoginResult);
          this.displayLogin = false;
          this.CheckUserLoggedin();
        } else {
          this.ErrorMessage = LoginResult.error.message;
        }
      } else {
        let CreateUserResult = await this.Service.signUpUser(this.LoginUser);
        if (!CreateUserResult.error) {
          this.setToken(CreateUserResult);
          this.displayLogin = false;
          this.CheckUserLoggedin();
          this.CreateUserProfile(CreateUserResult?.user?.id)
        } else {
          this.ErrorMessage = CreateUserResult.error.message;
        }
      }
    } catch (ex) {
      console.log(ex);
      this.Service.Hide();
    }
    this.Service.Hide();
  }
  async CreateUserProfile(userID: any) {
    this.Service.Show();
    try {
      let rslt = await this.Service.SavetoTable('UserDetails', { uuid: userID, URole: 'C' });
    } catch (ex) {
      console.log(ex);
    }
    this.Service.Hide();
  }
  setToken(response: any) {
    if (response.data.confirmation_sent_at && !response.data.access_token) {
      alert('Confirmation Email Sent')
    } else {
      // console.log(response.user.email);
    }
  }
  CheckUserLoggedin() {
    this.Service.Show();
    try {
      let loguser = this.Service.getCurrentUser();
      if (loguser) {
        this.LoggedUser = loguser;
        this.isUserAuth = true;
        this.EventUserLogged.emit(this.isUserAuth);
        this.GetUserRole().then((x) => {
          if (!x.error) {
            this.UserRole = x.data[0].URole;
          }
        });
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
    this.Service.Hide();
  }
  async GetUserRole() {
    return await this.Service.MatchQuery('UserDetails', { uuid: this.LoggedUser.id }, 'URole');
  }
  LogOutUser() {
    try {
      let rslt = this.Service.LogOutUser();
      this.CheckUserLoggedin();
    } catch (ex) {
      console.log(ex);
    }
  }
  RouteCart() {
    this.Route.navigateByUrl("/Cart");
  }
}
