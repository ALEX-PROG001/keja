// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const auth = getAuth(app);

export default app;