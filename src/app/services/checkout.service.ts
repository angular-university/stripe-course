import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: "root"
})
export class CheckoutService {

    constructor(private http:HttpClient) {

    }

    startCourseCheckoutSession(courseId:string) {
        return this.http.post("/api/checkout", {
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
            callBackUrl += port;
        }

        callBackUrl+= "/stripe-checkout";

        return callBackUrl;
    }

}

