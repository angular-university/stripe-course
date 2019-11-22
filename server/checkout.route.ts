

import {Request, Response} from "express";
import {getDocData} from './db-utils';
import {db} from './init-db';
import {STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY} from './env';

const stripe = require('stripe')(STRIPE_SECRET_KEY);


export async function createCheckoutSession(req: Request, res: Response) {

  try {

    const courseId = req.body.courseId,
          callbackUrl = req.body.callbackUrl;

    console.log("Purchasing course with id: ", courseId);

    // get the course from the database
    const course = await getDocData(`courses/${courseId}`);

    if (!course) {
      const message = 'Could not find course with courseId ' + courseId;
      console.log(message);
      res.status(500).json({message});
      return;
    }

    // Add a new document with a generated id.
    const purchaseSession = db.collection("purchaseSessions").doc();

    const sessionConfig = {
      success_url: `${callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${purchaseSession.id}&courseId=${courseId}`,
      cancel_url: `${callbackUrl}?purchaseResult=failed`,
      payment_method_types: ['card'],
      client_reference_id: purchaseSession.id,
      line_items: [{
        currency: 'usd',
        amount: course.price * 100,
        quantity: 1,
        name: course.titles.description
      }]
    };

    console.log(sessionConfig);

    // create a checkout session to purchase the course
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // save the ongoing purchase session
    await purchaseSession.set({
      courseId,
      //userId,
      status: 'ongoing'
    });

    const stripeSession = {
      stripeSessionId:session.id,
      stripePublicKey: STRIPE_PUBLIC_KEY
    };

    res.status(200).json(stripeSession);
  }
  catch (error) {
    console.log('Unexpected error occurred while purchasing course: ', error);
    res.status(500).json({error});
  }


}
