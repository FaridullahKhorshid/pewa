import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.authService.getToken();
    if (token != null) {
      let newReq = this.addToken(req, token)
      return this.customHandle(newReq, next);
    } else {
      return this.customHandle(req, next);
    }
  }

  private customHandle(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      catchError(async (err: HttpErrorResponse) => {
        if (err.status === 401 || err.status == 500) {
          if (req.url.endsWith('/refresh-token')) {
            this.authService.signOut();
            this.router.navigate(["login"]);
            return throwError(err);
          } else {
            await this.authService.refreshToken();
            let refreshedToken = this.authService.getToken();
            console.log(req);
            if (refreshedToken != null) return next.handle(this.addToken(req, refreshedToken))
          }
        }
        console.log(err.error.message);
        return throwError(err);
      }));
  }

  private addToken(req: HttpRequest<any>, token: String) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
