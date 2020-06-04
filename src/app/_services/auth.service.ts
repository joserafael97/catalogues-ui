import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private API_URL = environment.API_URL;
  private currenContaSubject: BehaviorSubject<Account>;
  public currentUser: Observable<Account>;


  constructor(private http: HttpClient) {
    this.currenContaSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currenContaSubject.asObservable();
  }

  public get currentUserValue(): Account {
    return this.currenContaSubject.value;
  }

  login(username: string, senha: string) {
    return this.http.post<any>(this.API_URL + '/auth/login', { username, senha })
      .pipe(map(result => {

        if (result && result.token) {
          localStorage.setItem('currentUser', JSON.stringify(result));
          this.currenContaSubject.next(result);
        }

        return result;

      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currenContaSubject.next(null);
  }
}
