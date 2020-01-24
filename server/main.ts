
const dotenv = require("dotenv");

const result = dotenv.config();

if (result.error) {
    throw result.error;
}
// uncomment to see the content of your environment variables
// console.log("Loaded environment config: ", result.parsed);

import {initServer} from './server';

initServer();
