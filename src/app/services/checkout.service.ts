import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSession} from '../model/checkout-session.model';

declare const Stripe;


@Injectable({
    providedIn: "root"
})
export class CheckoutService {

    constructor(private http:HttpClient) {

    }

    startCourseCheckoutSession(courseId:string): Observable<CheckoutSession> {
        return this.http.post<CheckoutSession>("/api/checkout", {
            courseId,
            callbackUrl: this.buildCallbackUrl()
        })
    }

    buildCallbackUrl() {

        const protocol = window.location.protocol,
            hostName = window.location.hostname,
            port = window.location.port;

        let callBackUrl = `${protocol}//${hostName}`;

        if (port) {
            callBackUrl += ":" + port;
        }

        callBackUrl+= "/stripe-checkout";

        return callBackUrl;
    }

    redirectToCheckout(session: CheckoutSession) {

        const stripe = Stripe(session.stripePublicKey);

        stripe.redirectToCheckout({
            sessionId: session.stripeCheckoutSessionId
        });
    }
}

