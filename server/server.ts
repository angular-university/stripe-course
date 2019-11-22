
// load environment variables before any other imports
const dotenv = require('dotenv');


const result = dotenv.config();

if (result.error) {
  throw result.error;
}


console.log("Loaded environment config: ", result.parsed);


import {getUserMiddleware} from './get-user.middleware';
import * as express from 'express';
import {Application} from "express";
import {createCheckoutSession} from './checkout.route';

const bodyParser = require('body-parser');



const app: Application = express();


app.route('/api/checkout').post(bodyParser.json(), getUserMiddleware, createCheckoutSession);




const httpServer = app.listen(9000, () => {
  console.log("HTTP REST API Server running at http://localhost:9000");
});
