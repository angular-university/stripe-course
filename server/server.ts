
import * as express from 'express';
import {Application} from "express";
import {createCheckoutSession} from './checkout.route';
import {getUserMiddleware} from './get-user.middleware';
import {stripeWebhooks} from './stripe-webhooks.route';



export function initServer() {

    const bodyParser = require('body-parser');

    const app:Application = express();

    app.route("/").get((req, res) => {
        res.status(200).send("<h1>API is up and running!</h1>");
    });

    app.route("/api/checkout").post(
        bodyParser.json(), getUserMiddleware, createCheckoutSession);

    app.route("/stripe-webhooks").post(
        bodyParser.raw({type:'application/json'}), stripeWebhooks);

    const PORT = process.env.PORT || 9000;

    app.listen(PORT, () => {
        console.log("HTTP REST API Server running at port " + PORT);
    });

}
