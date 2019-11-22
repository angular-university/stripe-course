import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) {

  }

  createBuyCourseCheckoutSession(courseId:string) {

    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}`;

    if (port) {
      callbackUrl+= `:${port}`;
    }

    callbackUrl += `/stripe-checkout`;

    return this.http.post('/api/checkout', {courseId, callbackUrl});
  }



}
