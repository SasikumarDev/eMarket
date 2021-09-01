import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  @Input('AllowedTypes') AllowedTypes: Array<string> = [];
  @Output('OnChangeEvent') OnChangeEvent: EventEmitter<any> = new EventEmitter();
  @Input("imageSrc") imageSrc: any;
  ErroMessage: string = '';
  constructor() { }

  ngOnInit(): void {
    if (!this.imageSrc) {
      this.imageSrc = 'assets/images/uploadbg.jpg';
    }
  }

  UploadContainerClick() {
    document.getElementById('fileupldcmp')?.click();
  }

  HandleChange(e: any) {
    let filevalidatedResult = this.ValidateFileType(e?.target?.files);
    if (filevalidatedResult) {
      this.OnChangeEvent.emit(e?.target?.files);
      let filereader = new FileReader();
      filereader.readAsDataURL(e?.target?.files[0]);
      filereader.onload = (_event) => {
        this.imageSrc = filereader.result;
      }
    } else {
      this.imageSrc = 'assets/images/uploadbg.jpg';
    }
  }

  ValidateFileType(files: any): boolean {
    let rtnValue = true;
    if (this.AllowedTypes.length === 0) {
      return rtnValue;
    } else {
      let FileExe = files[0].name.substr(files[0].name.lastIndexOf('.') + 1);
      if (!this.AllowedTypes.includes(FileExe)) {
        rtnValue = false;
        this.ErroMessage = `Only ${this.AllowedTypes.toString()} are allowed.`
      }
      if (files[0].size > 50000) {
        rtnValue = false;
        this.ErroMessage = 'File size should be below 500kb';
      }
      return rtnValue;
    }
  }

}
