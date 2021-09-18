import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { Login } from '../Models/model-context';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
  SavetoTable(Tablename: string, Values: any) {
    return this.supabase.from(Tablename).insert(Values);
  }
  Show() {
    this.isLoading.next(true);
  }
  Hide() {
    this.isLoading.next(false);
  }
  MatchQuery(Tablename: string, Condition: any, SelectColumns?: string | undefined) {
    SelectColumns = !SelectColumns ? undefined : SelectColumns;
    return this.supabase.from(Tablename).select(SelectColumns).match(Condition)
  }
  InsertData(tableName: string, Parmeters: any) {
    return this.supabase.from(tableName).insert([Parmeters]);
  }
  CheckExistence(TableName: string, columnNames: string, Condition: any) {
    return this.supabase.from(TableName).select(columnNames, { count: 'exact', head: true }).match(Condition);
  }
  UploadProductImage(Filename: string, ProductImage: File) {
    return this.supabase.storage.from('products').upload(`public/${Filename}`, ProductImage);
  }
  GetImageURL(Filename: string) {
    return this.supabase.storage.from('products').getPublicUrl(`public/${Filename}`);
  }
  UpdateTable(Tablename: string, UpdateColumn: any, MatchCondtion: any) {
    return this.supabase.from(Tablename).update(UpdateColumn).match(MatchCondtion)
  }
  SelectData(TableName: string, SelectColumns?: string) {
    SelectColumns = !SelectColumns ? undefined : SelectColumns;
    return this.supabase.from(TableName).select(SelectColumns);
  }
  SelectDataEdit(tableName: string, ColumnName: string, ColumnValue: string, SelectColumns?: string) {
    SelectColumns = !SelectColumns ? undefined : SelectColumns;
    return this.supabase.from(tableName).select(SelectColumns).eq(ColumnName, ColumnValue);
  }
  CheckExistenceEdit(tablename: string, columnNames: string, nqColumn: string, nqValue: string, MatchCondition: any) {
    return this.supabase.from(tablename).select(columnNames, { count: 'exact', head: true }).neq(nqColumn, nqValue).match(MatchCondition);
  }
  DeleteData(tableName: string,MatchCondition: any) {
    return this.supabase.from(tableName).delete().match(MatchCondition);
  }
}
