import { Directive, Input } from '@angular/core';
import { SupabaseService } from '../Service/supabase.service';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCheckExistence]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CheckExistenceDirective, multi: true }]
})
export class CheckExistenceDirective implements Validator {
  Result: number | null = 0;
  @Input("FormMode") FormMode: string = 'A';
  @Input("NqField") NqField: Array<string> = [];
  @Input("TableName") TableName: string = '';
  @Input("CName") CName: string = '';
  @Input("MatchProp") MatchProp: string = '';
  ValueParms: any = {};
  constructor(private Service: SupabaseService) { }

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    this.ValueParms[this.MatchProp] = control.value.trim();
    if (this.FormMode === 'A') {
      this.Result = await (await this.Service.CheckExistence(this.TableName, this.CName, this.ValueParms)).count;
      if (!this.Result) {
        return null;
      } else {
        return { appCheckExistence: true };
      }
    } else if (this.FormMode === 'E' && this.NqField) {
      this.Result = await (await this.Service.CheckExistenceEdit(this.TableName, this.CName, this.NqField[0],
        this.NqField[1], this.ValueParms)).count;
      if (!this.Result) {
        return null;
      } else {
        return { appCheckExistence: true };
      }
    } else {
      return null;
    }
  }

}
