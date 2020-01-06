

const admin = require('firebase-admin');

const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

admin.initializeApp({
   credential: admin.credential.cert(serviceAccountPath),
   databaseURL:process.env.FIRESTORE_DATABASE_URL
});


export const auth = admin.auth();
