
import {stripeWebhooks} from './stripe-webhooks.route';
import {getUserMiddleware} from './get-user.middleware';
import * as express from 'express';
import {Application} from "express";
import {createCheckoutSession} from './checkout.route';



export function initServer() {

  const bodyParser = require('body-parser');

  const app: Application = express();

  app.route('/api/checkout').post(bodyParser.json(), getUserMiddleware, createCheckoutSession);

  app.route('/stripe-webhooks').post(bodyParser.raw({type: 'application/json'}), stripeWebhooks);

  app.listen(9000, () => {
    console.log("HTTP REST API Server running at http://localhost:9000");
  });

}

