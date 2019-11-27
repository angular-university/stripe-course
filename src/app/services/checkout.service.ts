import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSession} from '../model/checkout-session.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first} from 'rxjs/operators';

declare const Stripe;


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore) {

  }

  startPurchaseCourseCheckoutSession(courseId:string): Observable<CheckoutSession> {
    return this.http.post<CheckoutSession>('/api/checkout', {
      courseId,
      callbackUrl: this.buildCallbackUrl()
    });
  }

  startPurchaseSubscriptionCheckoutSession(pricingPlanId:string): Observable<CheckoutSession> {
    return this.http.post<CheckoutSession>('/api/checkout', {
      pricingPlanId,
      callbackUrl: this.buildCallbackUrl()
    });
  }

  waitForPurchaseToComplete(ongoingPurchaseSessionId: string): Observable<any> {
    return this.afs.doc<any>(`purchaseSessions/${ongoingPurchaseSessionId}`)
      .valueChanges()
      .pipe(
        filter(purchase => purchase.status == "completed"),
        first()
      )
  }

  redirectToCheckout(session: CheckoutSession) {

    const stripe = Stripe(session.stripePublicKey);

    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId
    });

  }

  private buildCallbackUrl() {
    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}`;

    if (port) {
      callbackUrl+= `:${port}`;
    }

    callbackUrl += `/stripe-checkout`;

    return callbackUrl;
  }

}
