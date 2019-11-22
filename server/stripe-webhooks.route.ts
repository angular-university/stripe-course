import {Request, Response} from 'express';
import {getDocData} from './db-utils';
import {db} from './init-db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export async function stripeWebhooks(req: Request, res: Response) {

  const sig = req.headers['stripe-signature'];

  try {

    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_FULFILLMENT_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await onCheckoutSessionCompleted(session);
    } else {
      console.log('Received event: ' + event.type);
    }

  } catch (err) {
    console.log('Error processing webhook event, reason: ', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Return a response to Stripe to acknowledge the event
  res.json({received: true});
}


async function onCheckoutSessionCompleted(session) {

  console.log('Handling checkout session: ', JSON.stringify(session));

  const purchaseSessionId = session.client_reference_id;

  const purchaseSession = await getDocData(`purchaseSessions/${purchaseSessionId}`);

  const stripeCustomerId = session.customer,
    userId = purchaseSession.userId,
    courseId = purchaseSession.courseId;

  if (courseId) {
    await fulfillCoursePurchase(purchaseSessionId, userId, stripeCustomerId, courseId);
  }

}


async function fulfillCoursePurchase(purchaseSessionId: string, userId: string, stripeCustomerId: string, courseId: string) {

  const batch = db.batch();

  const purchaseSessionRef = db.doc(`purchaseSessions/${purchaseSessionId}`);

  batch.update(purchaseSessionRef, {status: 'completed'});

  const userPurchasesRef = db.doc(`userPurchases/${userId}`);

  batch.set(userPurchasesRef, {stripeCustomerId}, {merge:true});

  const userCourseOwnedRef = db.collection(`userPurchases/${userId}/coursesOwned/${courseId}`).doc();

  batch.set(userCourseOwnedRef, {owned:true});

  return batch.commit();

}
