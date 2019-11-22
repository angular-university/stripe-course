import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSession} from '../model/checkout-session.model';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) {

  }

  startPurchaseCourseCheckoutSession(courseId:string): Observable<CheckoutSession> {

    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}`;

    if (port) {
      callbackUrl+= `:${port}`;
    }

    callbackUrl += `/stripe-checkout`;

    return this.http.post<CheckoutSession>('/api/checkout', {courseId, callbackUrl});
  }



}
