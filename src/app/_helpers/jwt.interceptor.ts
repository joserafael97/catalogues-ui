import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../_services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.auth.currentUser.subscribe(token => {       
    
            if (token) {
                request = request.clone({
                    setHeaders: { 
                        Authorization: `JWT ` + token['token']
                    }
                });
            }

        })
        return next.handle(request);

    }
}