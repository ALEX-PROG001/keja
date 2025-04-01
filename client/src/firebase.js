import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyL7j6iqMhQLWI5crPuNFFCcKYGcFjEww",
  authDomain: "keja-16726.firebaseapp.com",
  projectId: "keja-16726",
  storageBucket: "keja-16726.firebasestorage.app",
  messagingSenderId: "621375142065",
  appId: "1:621375142065:web:cebaf996666bd26588ca90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Use user's preferred language

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection
  access_type: 'offline'    // Get refresh token
});

// Default export
export default app;