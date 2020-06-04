import { Component, OnInit, ChangeDetectorRef,  ViewChild, AfterViewInit } from '@angular/core';

import { VendorService } from '../_services/vendor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AlertComponent } from '../shared/alert/alert.component';
import { Vendor } from '../_models/vendor.class';
import { SelectionModel } from '@angular/cdk/collections';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

export interface VendorsApi {
  results: Vendor[];
  count: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  vendors: Vendor[] = [];
  dataSource: MatTableDataSource<Vendor>;
  selection = new SelectionModel<Vendor>(true, []);
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  currentDisplay = 'desktop';
  
  @ViewChild(MatPaginator,  {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  constructor(
    private vendorService: VendorService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
  ) {
    console.log(" window.innerWidth",  window.innerWidth)
    this.currentDisplay = window.innerWidth <= 600 ? 'mobile' : 'desktop';
  }

  displayedColumns: string[] = ['select', 'id', 'name', 'cnpj', 'city', 'products',  'edit'];


  columnDefinitions = [
    { def: 'select', showMobile: true },
    { def: 'id', showMobile: false },
    { def: 'name', showMobile: true },
    { def: 'cnpj', showMobile: false },
    { def: 'city', showMobile: false },
    { def: 'products', showMobile: true },
    { def: 'edit', showMobile: true },

  ];
   
  getDisplayedColumns(): string[] {
    const isMobile = this.currentDisplay === 'mobile';
    return this.columnDefinitions
      .filter(cd => !isMobile || cd.showMobile)
      .map(cd => cd.def);
  }

  initVendors() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log(this.sort)
          return this.vendorService.getAllByPageAndSort(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(vendors_data => {
        this.vendors = vendors_data;
        this.dataSource.data = this.vendors;
       
      });
   
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.vendors);

  }

  ngAfterViewInit() {
    this.initVendors()
  }



  openSnackBar(msg: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: msg,
      verticalPosition: 'top',
      duration: 10 * 1000,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

 }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.vendors.length;
    return numSelected === numRows;
  }

  deleteSelectedVendor() {
    console.log("click remove")
    this.spinner.show();
    for (let vendor of this.selection.selected){
      console.log("click vendor id: ", vendor.id)
      this.vendorService.delete(vendor.id).subscribe(result => {
        this.spinner.hide();
        this._snackBar.openFromComponent(AlertComponent, {
          data: "Removed Vendor " + vendor.name+".",
          verticalPosition: 'top',
          duration: 10 * 1000,
        });
        this.initVendors();
      }, error => {
          this.openSnackBar("Ops ocorreu um erro.")
          this.spinner.hide();
      });

    }

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Vendor): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
