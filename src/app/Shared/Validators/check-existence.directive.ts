import { Directive } from '@angular/core';
import { SupabaseService } from '../Service/supabase.service';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCheckExistence]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CheckExistenceDirective, multi: true }]
})
export class CheckExistenceDirective implements Validator {
  Result: number | null = 0;
  constructor(private Service: SupabaseService) { }

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    this.Result = await (await this.Service.CheckExistence('Category', 'CID', { CDesc: control.value.trim() })).count;
    if (!this.Result) {
      return null;
    } else {
      return { appCheckExistence: true };
    }
  }

}
