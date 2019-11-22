import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IdTokenService} from './id-token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: IdTokenService) {

  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const authJwtToken = this.token.authJwtToken;

    if (authJwtToken) {
      const cloned = req.clone({
        headers: req.headers
          .set('Authorization',authJwtToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
