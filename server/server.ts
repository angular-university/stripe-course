
import * as express from 'express';
import {Application} from "express";
import {createCheckoutSession} from './checkout.route';
import {getUserMiddleware} from './get-user.middleware';



export function initServer() {

    const bodyParser = require('body-parser');

    const app:Application = express();

    app.route("/").get((req, res) => {
        res.status(200).send("<h1>API is up and running!</h1>");
    });

    app.route("/api/checkout").post(
        bodyParser.json(), getUserMiddleware, createCheckoutSession);

    const PORT = process.env.PORT || 9000;

    app.listen(PORT, () => {
        console.log("HTTP REST API Server running at port " + PORT);
    });

}
