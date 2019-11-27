

import {Request, Response} from "express";
import {getDocData} from './db-utils';
import {db} from './init-db';
import {Timestamp} from '@google-cloud/firestore';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
  userId:string;
  callbackUrl:string,
  courseId:string,
  pricingPlanId:string
}



export async function createCheckoutSession(req: Request, res: Response) {

  try {

    const info: RequestInfo = {
      courseId: req.body.courseId,
      userId: req["uid"],
      callbackUrl: req.body.callbackUrl,
      pricingPlanId: req.body.pricingPlanId
    };

    console.log("Purchasing course with id: ", info.courseId);

    if (!info.userId) {
      const message = 'User must be authenticated.';
      console.log(message);
      res.status(500).json({message});
      return;
    }

    if (info.courseId) {
      const snap = await db.doc(`users/${info.userId}/coursesOwned/${info.courseId}`).get();
      if (snap.exists) {
        const message = 'User already owns course with id ' + info.courseId;
        console.log(message);
        res.status(500).json({message});
        return;
      }
    }

    // Add a new document with a generated id.
    const purchaseSession = db.collection("purchaseSessions").doc();

    const user = await getDocData(`users/${info.userId}`);

    let sessionConfig;

    if (info.courseId) {
      const course = await getDocData(`courses/${info.courseId}`);
      sessionConfig = setupPurchaseCourseSession(info, user, purchaseSession.id,  course);
    }
    else if (info.pricingPlanId){
      const plan = await getDocData(`pricingPlans/${info.pricingPlanId}`);
      sessionConfig = setupSubscriptionSession(info, user, purchaseSession.id, plan);
    }

    console.log(sessionConfig);

    // create a checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    const checkoutSessionData:any = {
        userId: info.userId,
      status: 'ongoing',
      created: Timestamp.now()
    };

    if (info.courseId) {
      checkoutSessionData.courseId = info.courseId;
    }

    if (info.pricingPlanId) {
      checkoutSessionData.pricingPlanId = info.pricingPlanId;
    }

    // save the ongoing purchase session
    await purchaseSession.set(checkoutSessionData);

    // build HTTP response
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

function setupBaseSessionConfig(callbackUrl:string, purchaseSessionId:string, user) {
  const config:any = {
    success_url: `${callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${purchaseSessionId}`,
    cancel_url: `${callbackUrl}?purchaseResult=failed`,
    payment_method_types: ['card'],
    client_reference_id: purchaseSessionId
  };

  if (user && user.stripeCustomerId) {
    config.customer = user.stripeCustomerId;
  }
  return config;
}


function setupPurchaseCourseSession(info: RequestInfo, user, purchaseSessionId:string, courseData) {

  const config = setupBaseSessionConfig(info.callbackUrl, purchaseSessionId, user);

  config.line_items = [{
    currency: 'usd',
    amount: courseData.price * 100,
    quantity: 1,
    name: courseData.titles.description
  }];
  return config;
}


function setupSubscriptionSession(info: RequestInfo, user, purchaseSessionId:string, plan) {

  const config = setupBaseSessionConfig(info.callbackUrl, purchaseSessionId, user);

  config.subscription_data = {
    items: [{plan: plan.stripePlanId}]
  };

  return config;

}


