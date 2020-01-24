import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSession} from '../model/checkout-session.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first} from 'rxjs/operators';
import {environment} from '../../environments/environment';

declare const Stripe;


@Injectable({
    providedIn: "root"
})
export class CheckoutService {

    private jwtAuth:string;

    constructor(private http:HttpClient,
                private afAuth: AngularFireAuth,
                private afs: AngularFirestore) {

        afAuth.idToken.subscribe(jwt => this.jwtAuth = jwt);

    }

    startCourseCheckoutSession(courseId:string): Observable<CheckoutSession> {

        const headers = new HttpHeaders().set("Authorization", this.jwtAuth);

        return this.http.post<CheckoutSession>(environment.api.baseUrl +  "/api/checkout", {
            courseId,
            callbackUrl: this.buildCallbackUrl()
        }, {headers})
    }

    startSubscriptionCheckoutSession(pricingPlanId:string): Observable<CheckoutSession> {

        const headers = new HttpHeaders().set("Authorization", this.jwtAuth);

        return this.http.post<CheckoutSession>(environment.api.baseUrl +  "/api/checkout", {
            pricingPlanId,
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

    waitForPurchaseCompleted(ongoingPurchaseSessionId: string):Observable<any> {
        return this.afs.doc<any>(`purchaseSessions/${ongoingPurchaseSessionId}`)
            .valueChanges()
            .pipe(
                filter(purchase => purchase.status == "completed"),
                first()
            )
    }
}









