
import {Request, Response} from 'express';
import {db, getDocData} from './database';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export async function stripeWebhooks(req: Request, res:Response) {

    try {

        const signature = req.headers["stripe-signature"];

        const event = stripe.webhooks.constructEvent(
            req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type == "checkout.session.completed") {
            const session = event.data.object;
            await onCheckoutSessionCompleted(session);

        }

        res.json({received:true});

    }
    catch(err) {
        console.log('Error processing webhook event, reason: ', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}


async function onCheckoutSessionCompleted(session) {

    const purchaseSessionId = session.client_reference_id;

    const {userId, courseId} = await getDocData(`purchaseSessions/${purchaseSessionId}`);

    if (courseId) {
        await fulfillCoursePurchase(userId, courseId, purchaseSessionId, session.customer);
    }
}

async function fulfillCoursePurchase(userId:string, courseId:string,
                                     purchaseSessionId:string,
                                     stripeCustomerId:string) {

    const batch = db.batch();

    const purchaseSessionRef = db.doc(`purchaseSessions/${purchaseSessionId}`);

    batch.update(purchaseSessionRef, {status: "completed"});

    const userCoursesOwnedRef = db.doc(`users/${userId}/coursesOwned/${courseId}`);

    batch.create(userCoursesOwnedRef, {});

    const userRef = db.doc(`users/${userId}`);

    batch.set(userRef, {stripeCustomerId}, {merge: true});

    return batch.commit();

}























