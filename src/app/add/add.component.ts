import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { MatSnackBar, MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Vendor } from '../_models/vendor.class';
import { VendorService } from '../_services/vendor.service';
import { Product } from '../_models/product.class';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  templateUrl: 'product-dialog.html',
})
export class ProductDialog {

  productForm: FormGroup;
  private product = new Product()
  submetido = false;


  constructor(
    public dialogRef: MatDialogRef<ProductDialog>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Product) {
      this.createForm(this.product);
      
      if (data !== undefined) {
        this.product = data;
        this.productForm.controls['name'].setValue(data.name)
        this.productForm.controls['code'].setValue(data.code)
        this.productForm.controls['price'].setValue(data.price)

      }
    }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  createProduct() {

    this.submetido = true;
    if (this.productForm.invalid) {
      return;
    }
    this.setProductForm();
    this.dialogRef.close(this.product);

  }

  setProductForm() {
    this.product.name = this.productForm.value.name;
    this.product.code = this.productForm.value.code;
    this.product.price = this.productForm.value.price;
  }

  createForm(product: Product) {
    this.productForm = this.formBuilder.group({
      name: [product.name, Validators.required],
      code: [product.code, [Validators.required]],
      price: [product.price, Validators.min(0)],
    },{});
  }

  get form() { return this.productForm.controls; }


}


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  vendorForm: FormGroup;
  submetido = false;
  nivelItemDesativado = true
  listaNiveis = [];
  cnpjMask =  [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
  private vendor = new Vendor()
  displayedColumns: string[] = ['select','name'];
  products:Product[] = [];
  isDetailOperation = false;
  

  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);

  constructor(
    private vendorService: VendorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private zone: NgZone,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activatedRoute:ActivatedRoute,
    private router: Router,) { }

    isEditOperation:boolean = false
    
  ngOnInit() {
    this.createForm(this.vendor);
    this.dataSource = new MatTableDataSource(this.products)
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] !== undefined){
        
        if (this.activatedRoute.snapshot.url[0].path == 'edit')
          this.isEditOperation=true;

        if (this.activatedRoute.snapshot.url[0].path == 'detail')
          this.isDetailOperation = true

        this.vendorService.findById(+params['id']).subscribe(result =>{
          this.products = result.products;
          this.vendor = result;
          this.vendorForm.controls['name'].setValue(result.name)
          this.vendorForm.controls['city'].setValue(result.city)
          this.vendorForm.controls['cnpj'].setValue(result.cnpj)

          if (this.isDetailOperation) {
            this.vendorForm.controls['name'].disable();
            this.vendorForm.controls['city'].disable();
            this.vendorForm.controls['cnpj'].disable();
          }

          this.dataSource = new MatTableDataSource(this.products)

        }, (error) => {

        });
    }
    });
  
  }

  openDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '250px',
      height: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined || result !== null){
        if (this.isEditOperation){
          for (let p of this.products){
            if(result.id === p.id){
              p.name = result.name;
              p.code = result.code;
              p.price = result.price;
              this.openSnackBar("Product Updated.")
              break;

            }
          }
        }else{
          this.openSnackBar("New Product registered.")
          this.products.push(result)
        }
    }
      
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.products.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  get form() { return this.vendorForm.controls; }

  createForm(vendor: Vendor) {
    this.vendorForm = this.formBuilder.group({
      name: [vendor.name, Validators.required],
      cnpj: [vendor.cnpj, [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      city: [vendor.city],
    },{});
  }


  setVendorForm() {
    this.vendor.name = this.vendorForm.value.name;
    this.vendor.cnpj = this.vendorForm.value.cnpj;
    this.vendor.city = this.vendorForm.value.city;

  }


  createVendor() {

    this.submetido = true;

    if (this.vendorForm.invalid) {
      return;
    }

    this.spinner.show();
    this.setVendorForm();

    this.vendor.products = this.products;

    this.vendorService.create(this.vendor).subscribe(data => {
      this.spinner.hide();
      this.openSnackBar("New Vendor successfully registered.")
      this.zone.run(() => this.router.navigate(['']));
    }, (error) => {
      this.spinner.hide();
      this.showErrorMessages(error);
    });

  }

  updateVendor() {
    console.log("=============================update call")
    this.submetido = true;

    if (this.vendorForm.invalid) {
      return;
    }

    this.spinner.show();
    this.setVendorForm();

    this.vendor.products = this.products;

    this.vendorService.update(this.vendor, this.vendor.id).subscribe(data => {
      this.spinner.hide();
      this.openSnackBar("Vendor updated.")
      this.zone.run(() => this.router.navigate(['']));
    }, (error) => {
      this.spinner.hide();
      this.showErrorMessages(error);
    });

  }

  showErrorMessages(error){
    if (error.name !== undefined) {
      this.openSnackBar(error.name)
    }

    if (error.cnpj !== undefined) {
      this.openSnackBar(error.cnpj)
    }
    
    if (error.cnpj === undefined && error.name !== undefined)
      this.openSnackBar("ops ocorreu um erro.")
  }



  deleteSelectedProduct() {
    this.spinner.show();
    for (let product of this.selection.selected){
      this.products = this.products.filter(function( p ) {
          return p.id !== product.id;
      });
    }
    this.spinner.hide();
    this.dataSource = new MatTableDataSource(this.products);    

  }


  openSnackBar(msg: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: msg,
      verticalPosition: 'top',
      duration: 10 * 1000,
    });
  }


}
