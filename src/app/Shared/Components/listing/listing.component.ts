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
  Loading: boolean = false;
  selectedRow: any;
  constructor(private Route: Router, private ActiveRoute: ActivatedRoute, private Service: SupabaseService) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((x) => {
      this.Loading = true;
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
      this.QueryParms = { Keys: '', FormMode: 'A', Redirect: this.Route.url, Menu: this.QueryParms.Menu };
      this.cols = [{ field: 'CID', header: 'ID', dataType: 'text' }, { field: 'CDesc', header: 'Description', dataType: 'text' }, { field: 'CStatus', header: 'Status', dataType: 'boolean' }];
      this.Loading = false;
    }
  }

  handleAdd() {
    if (this.QueryParms.Menu === 'Category') {
      this.Route.navigate(['/Category'], { queryParams: { Keys: '', FormMode: 'A', Redirect: this.Route.url, Menu: this.QueryParms.Menu } });
    }
  }

  handleRefresh() {
    this.Loading = true;
    this.FillDataSource();
  }

  handleSelect(data: any) {
    if (this.QueryParms.Menu === 'Category') {
      this.Route.navigate(['/Category'], { queryParams: { Keys: data?.CID, FormMode: 'E', Redirect: this.Route.url, Menu: this.QueryParms.Menu } });
    }
  }
}
