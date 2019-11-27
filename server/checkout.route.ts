

import {Request, Response} from "express";
import {getDocData} from './db-utils';
import {db} from './init-db';
import {Timestamp} from '@google-cloud/firestore';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



export async function createCheckoutSession(req: Request, res: Response) {

  try {

    const courseId = req.body.courseId,
          userId = req["uid"],
          callbackUrl = req.body.callbackUrl;

    console.log("Purchasing course with id: ", courseId);

    // get the course from the database
    const courseData = await getDocData(`courses/${courseId}`);

    if (!userId) {
      const message = 'User must be authenticated.';
      console.log(message);
      res.status(500).json({message});
      return;
    }

    if (!courseData) {
      const message = 'Could not find course with courseId ' + courseId;
      console.log(message);
      res.status(500).json({message});
      return;
    }

    if (courseId) {
      const snap = await db.doc(`users/${userId}/coursesOwned/${courseId}`).get();
      if (snap.exists) {
        const message = 'User already owns course with id ' + courseId;
        console.log(message);
        res.status(500).json({message});
        return;
      }
    }

    // Add a new document with a generated id.
    const purchaseSession = db.collection("purchaseSessions").doc();

    const sessionConfig = await setupPurchaseCourseSession(userId, callbackUrl, purchaseSession.id, courseId, courseData);

    console.log(sessionConfig);

    // create a checkout session to purchase the course
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // save the ongoing purchase session
    await purchaseSession.set({
      courseId,
      userId,
      status: 'ongoing',
      created: Timestamp.now()
    });

    const stripeSession = {
      stripeCheckoutSessionId:session.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    };

    res.status(200).json(stripeSession);
  }
  catch (error) {
    console.log('Unexpected error occurred while purchasing course: ', error);
    res.status(500).json({error});
  }

}

function setupBaseSessionConfig(callbackUrl:string, purchaseSessionId:string) {
  return {
    success_url: `${callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${purchaseSessionId}`,
      cancel_url: `${callbackUrl}?purchaseResult=failed`,
    payment_method_types: ['card'],
    client_reference_id: purchaseSessionId
  }
}


async function setupPurchaseCourseSession(userId:string, callbackUrl:string, purchaseSessionId:string, courseId:string,  courseData) {

  const config:any = setupBaseSessionConfig(callbackUrl, purchaseSessionId);

  const user = await getDocData(`users/${userId}`);

  if (user && user.stripeCustomerId) {
    config.customer = user.stripeCustomerId;
  }

  config.line_items = [{
    currency: 'usd',
    amount: courseData.price * 100,
    quantity: 1,
    name: courseData.titles.description
  }];

  return config;

}

