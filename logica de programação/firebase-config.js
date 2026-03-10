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
    apiKey: "AIzaSyABj93R2DcjKIoBPrCZYK_B6a_VYaH4-_4",
    authDomain: "code-chain-db.firebaseapp.com",
    projectId: "code-chain-db",
    storageBucket: "code-chain-db.firebasestorage.app",
    messagingSenderId: "595214265322",
    appId: "1:595214265322:web:0fe3d9864ebe07b291e093"
};

// Set to true once you've filled in your credentials above
export const FIREBASE_CONFIGURED = true;
