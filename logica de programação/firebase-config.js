/**
 * firebase-config.js — Firebase project configuration
 *
 * INSTRUCTIONS FOR BRINCABYTES INTEGRATION:
 * 1. Go to Firebase Console → your BrincaBytes project
 * 2. Project Settings → Your apps → Web app
 * 3. Copy the firebaseConfig object and replace the values below
 * 4. Enable: Authentication (Google + Email/Password), Firestore Database
 *
 * For BrincaBytes SSO (custom token):
 * - Your portal backend must use Firebase Admin SDK
 * - Generate a custom token for the logged-in user
 * - Pass that token to: AuthService.loginWithBrincaBytesToken(token)
 */

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    // Optional — for Realtime Database fallback:
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
};

// Set to true once you've filled in your credentials above
export const FIREBASE_CONFIGURED = false;
