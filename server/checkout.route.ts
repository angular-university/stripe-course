
import {Request, Response} from "express";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    courseId:string;
    callbackUrl:string;
}

export async function createCheckoutSession(req: Request, res: Response) {

    try {

        const info : RequestInfo = {
            courseId: req.body.courseId,
            callbackUrl: req.body.callbackUrl
        };

        console.log("Purchasing course with id: ", info.courseId);

        let sessionConfig;

        if (info.courseId) {
            sessionConfig = setupPurchaseCourseSession(info);
        }


        const session = await stripe.checkout.sessions.create(sessionConfig);



        res.status(200).send();

    }
    catch(error) {
        console.log('Unexpected error occurred while purchasing course: ', error);
        res.status(500).json({error: "Could not initiate Stripe checkout session"});
    }

}

function setupPurchaseCourseSession(info: RequestInfo) {

    const config = setupBaseSessionConfig(info);

    return config;
}


function setupBaseSessionConfig(info: RequestInfo) {
    const config: any = {
        payment_method_types: ['card'],
        success_url: `${info.callbackUrl}/?purchaseResult=success`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`
    };

    return config;
}





