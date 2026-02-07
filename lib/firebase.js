import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXx48UgGZznEIQ9fAEskr-C_a_hP-rJCg",
  authDomain: "my-app-43271.firebaseapp.com",
  projectId: "my-app-43271",
  storageBucket: "my-app-43271.firebasestorage.app",
  messagingSenderId: "1002583374322",
  appId: "1:1002583374322:web:6052dda0ce1335c2ce536b"
};

// كود ذكي لمنع إعادة إنشاء الـ App في Next.js أثناء الـ Reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();