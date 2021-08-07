import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { Login } from '../Models/model-context';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor(private Http: HttpClient) {
    this.supabase = createClient(environment.supabaseURL, environment.supabaseKEY);
  }
  signUpUser(Users: Login) {
    return this.supabase.auth.signUp({ email: Users.email, password: Users.Password });
  }
  LoginUser(User: Login) {
    return this.supabase.auth.signIn({ email: User.email, password: User.Password });
  }
  getCurrentUser() {
    return this.supabase.auth.user();
  }
  LogOutUser() {
   return this.supabase.auth.signOut();
  }
}
