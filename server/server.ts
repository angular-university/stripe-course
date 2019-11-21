import * as express from 'express';
import {Application} from "express";
import {createCheckoutSession} from './checkout.route';

const bodyParser = require('body-parser');



const app: Application = express();


//app.use(bodyParser.json());


app.route('/api/checkout').post(bodyParser.json(), createCheckoutSession);






const httpServer = app.listen(9000, () => {
  console.log("HTTP REST API Server running at http://localhost:9000");
});
