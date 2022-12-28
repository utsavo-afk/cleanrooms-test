// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp | undefined;

try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('ERROR_FAILED_TO_INIT_FIREBASE_APP');
}

const auth = getAuth(app);
const db = getFirestore(app as FirebaseApp);
const googleAuthProvider = new GoogleAuthProvider();
const restaurantsRef = collection(db, 'restaurant');

export function logAnalyticsEvent(eventName: string, additionalAttributes: object, userId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datalayer = (window as any).dataLayer;

  datalayer?.push({ event: eventName, user_id: userId, ...additionalAttributes });

  const analytics = getAnalytics();
  logEvent(analytics, eventName, { ...additionalAttributes });
}

// well export different firebase services like auth, firestore etc from here.
export { auth, googleAuthProvider, db, restaurantsRef };
