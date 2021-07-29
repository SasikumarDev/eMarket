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
    return this.supabase.auth.signIn(Users);
  }
  LoginUser(User: Login) {
    return this.supabase.auth.signUp(User);
  }
  getCurrentUser() {
    return this.supabase.auth.user();
  }
}