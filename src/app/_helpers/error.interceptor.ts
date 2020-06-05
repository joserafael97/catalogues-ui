import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            console.log("erro:", err.error)
           
            if (err.status === 401) {
                if (err.error.detail === 'Signature has expired.'){
                    return this.authService.auth().pipe(
                        switchMap(() => {
                            request = request.clone({
                                setHeaders: { 
                                    Authorization: `JWT ` + this.authService.currentUserValue['token']
                                }
                            });
                            return next.handle(request);
                        }));
                }else {
                    
                    this.authService.auth().pipe(
                        switchMap(() => {
                            request = request.clone({
                                setHeaders: { 
                                    Authorization: `JWT ` + this.authService.currentUserValue['token']
                                }
                            });
                            return next.handle(request);
                        }
                    ));
                   
                }
            }
           
            const error = err.error.message || err.statusText;
            return throwError(err.error);
        }))
    }
}