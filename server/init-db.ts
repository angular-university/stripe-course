
const admin = require('firebase-admin');

const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

/*
// Fetch the service account key JSON file contents
var serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRESTORE_DATABASE_URL
});

export const auth = admin.auth();

*/

const Firestore = require('@google-cloud/firestore');

export const db = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: serviceAccountPath,
});



