import { SupabaseService } from './../Service/supabase.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private Service: SupabaseService, private router: Router) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let usRole = await this.GetUserRole();
    if(usRole){
    if (usRole[0].URole.includes(route.data.role)) {
        return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
    } else {
    this.router.navigateByUrl('/');
      return false;
    }
  }
  async GetUserRole() {
    let loguser_ = this.Service.getCurrentUser();
    return await (await this.Service.MatchQuery('UserDetails', { uuid: loguser_?.id }, 'URole'))?.data;
  }

  UserRole() {
     this.GetUserRole().then((value: any[] | null) => {
      console.log(value);
      if (value) {
        return value[0].URole;
      } else {
        return null;
      }
    }).catch((ex) => {
      return null;
    });
  }

}
