/* eslint-disable @typescript-eslint/no-var-requires */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, GeoPoint } = require('firebase-admin/firestore');
const { setDoc } = require('firebase/firestore');

const restaurantsData = require('./restaurantsData.json');
const geohash = require('ngeohash');
require('dotenv').config();

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

restaurantsData.forEach(restaurant => {
  // geohash encode accepts args in (lat, long)
  const restaurantGeohash = geohash.encode(
    restaurant.restaurantGeoCoords.latitude,
    restaurant.restaurantGeoCoords.longitude
  );

  const restaurantGeoCoords = new GeoPoint(
    restaurant.restaurantGeoCoords.latitude,
    restaurant.restaurantGeoCoords.longitude
  );

  let restaurantObj = { ...restaurant, restaurantGeohash, restaurantGeoCoords };

  const restaurantRef = db.collection('restaurant').where('restaurantName', '==', restaurantObj.restaurantName);

  restaurantRef
    .get()
    .then(docSnapshot => {
      // If doc is already in DB, update it. Else create new doc
      if (docSnapshot._size > 0) {
        docSnapshot.forEach(doc => {
          doc._ref.set({ ...restaurantObj }).then(result => console.log('[UPDATED]', result));
          return;
        });
      } else {
        db.collection('restaurant')
          .add({
            ...restaurantObj,
          })
          .then(result => console.log('[CREATED]', result));
      }
    })
    .catch(err => console.log(err));
});
