import { SupabaseService } from './../../Service/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ListingColDef, ListingRouteParams } from '../../Models/model-context';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  QueryParms: ListingRouteParams = <ListingRouteParams>{};
  DataSource: any;
  cols: Array<ListingColDef> = [];
  selectedRow: any;
  constructor(private Route: Router, private ActiveRoute: ActivatedRoute, private Service: SupabaseService) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.QueryParms = x as ListingRouteParams;
      if (Object.keys(this.QueryParms).length === 0) {
        this.Route.navigateByUrl('/');
      } else {
        this.FillDataSource();
      }
    });
  }

  async FillDataSource() {
    let ds = await this.Service.SelectData('Category');
    this.DataSource = ds.data;
    if (this.QueryParms.Menu === 'Category') {
      this.cols = [{ field: 'CID', header: 'ID' }, { field: 'CDesc', header: 'Description' }]
    }
  }
  handleSelect(data: any){
  console.log(data);
  }

}
