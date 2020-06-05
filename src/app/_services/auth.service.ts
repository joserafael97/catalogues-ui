import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.API_URL;
  private USERNAME_APP = environment.username;
  private PASSWORD_APP = environment.password;

  private currentAuthsubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;


  constructor(private http: HttpClient) {
    this.currentAuthsubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('token')));
    this.currentUser = this.currentAuthsubject.asObservable();
  }

  public get currentUserValue(): string {
    return this.currentAuthsubject.value;
  }

  auth() {
    return this.http.post<any>(this.API_URL + '/auth/', { "username": this.USERNAME_APP, "password" :this.PASSWORD_APP })
      .pipe(map(result => {
    
        if (result && result.token) {
          localStorage.setItem('token', JSON.stringify(result.token));
          this.currentAuthsubject.next(result);
        }

        return result;

      }));
  }


  refreshToken() {
    return this.http.post<any>(this.API_URL + '/refresh-token/', { "token":  this.currentUserValue['token']})
      .pipe(map(result => {
        
        console.log("result auth", result.token)
        
        if (result && result.token) {
          localStorage.setItem('token', JSON.stringify(result.token));
          this.currentAuthsubject.next(result);
        }

        return result;

      }));
  }



  removeToken() {
    localStorage.removeItem('currentUser');
    this.currentAuthsubject.next(null);
  }


}
