import { Directive, EventEmitter, Input, ChangeDetectorRef, Output, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {
  @Input("ReplaceSpecialChar") ReplaceSpecialChar: boolean = false;
  @Input("TrimEmptySpace") TrimEmptySpace: boolean = false;
  constructor(private renderer: Renderer2, private elementRef: ElementRef, private Model: NgModel) { }

  @HostListener("blur")
  onBlur() {
    let value = this.Model.value||'';

    if (this.ReplaceSpecialChar && value) {
      value = value.replace(/[^a-zA-Z ]/g, "");
    }

    if (this.TrimEmptySpace && value) {
      value = value.trim();
    }
    this.renderer.setProperty(this.elementRef.nativeElement, "value", value);
    this.renderer.setAttribute(this.elementRef.nativeElement, "value", value);
    this.Model.update.emit(value);
  }
}
