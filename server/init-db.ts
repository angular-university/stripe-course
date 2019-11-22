
const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

console.log("Service account path: " + serviceAccountPath);


const Firestore = require('@google-cloud/firestore');

export const db = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: serviceAccountPath,
});




const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRESTORE_DATABASE_URL
});

export const auth = admin.auth();

