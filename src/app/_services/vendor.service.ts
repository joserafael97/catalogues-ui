import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vendor } from '../_models/vendor.class';
import { VendorsApi } from '../home/home.component';


@Injectable({
    providedIn: 'root'
})
export class VendorService {

    private API_URL = environment.API_URL+'/vendors/';

    constructor(private http: HttpClient) {

    }

    public create(vendor: Vendor): Observable<any> {
        return this.http.post(this.API_URL, vendor);
    }

    public update(vendor: Vendor, idVendor: number): Observable<any> {
        return this.http.put(this.API_URL +idVendor+'/', vendor);
    }

    public delete(idVendor: number): Observable<any> {
        return this.http.delete(this.API_URL + idVendor+'/' );
    }

    public getAll(): Observable<any> {
        return this.http.get(this.API_URL);
    }

    public findById(idVendor: number): Observable<any> {
        return this.http.get(this.API_URL+idVendor+'/');
    }

    getAllByPageAndSort(sort: string, order: string, page: number): Observable<VendorsApi> {    
        return this.http.get<VendorsApi>(this.API_URL+`?page=${page}&sort=${sort}&order=${order}`);
    }
}