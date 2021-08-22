import { Category } from './../../Shared/Models/model-context';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/Shared/Service/supabase.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Category: Category = <Category>{};
  FormMode: string = 'A';
  constructor(private Service: SupabaseService) { }

  ngOnInit(): void {
  }

  SaveCategory() {
    console.log(this.Category);
  }

}
