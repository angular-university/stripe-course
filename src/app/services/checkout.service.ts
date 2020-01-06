import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSession} from '../model/checkout-session.model';
import {AngularFireAuth} from '@angular/fire/auth';

declare const Stripe;


@Injectable({
    providedIn: "root"
})
export class CheckoutService {

    private jwtAuth:string;

    constructor(private http:HttpClient,
                private afAuth: AngularFireAuth) {

        afAuth.idToken.subscribe(jwt => this.jwtAuth = jwt);

    }

    startCourseCheckoutSession(courseId:string): Observable<CheckoutSession> {

        const headers = new HttpHeaders().set("Authorization", this.jwtAuth);

        return this.http.post<CheckoutSession>("/api/checkout", {
            courseId,
            callbackUrl: this.buildCallbackUrl()
        }, {headers})
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

