import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authJwtToken:string;

  constructor(private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authJwtToken) {
      const cloned = req.clone({
        headers: req.headers
          .set('Authorization',this.authJwtToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
