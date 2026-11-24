import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern safe for Next.js SSR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export interface FirebaseUserData {
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Triggers official Firebase Google popup authentication
 */
export const signInWithFirebaseGoogle = async (): Promise<FirebaseUserData> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.email) {
      throw new Error("Unable to retrieve email from Google account");
    }

    return {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      avatar: user.photoURL || undefined,
    };
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in window was closed before completion.");
    }
    if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Sign-in request was cancelled.");
    }
    if (error.code === "auth/unauthorized-domain") {
      const currentHost = typeof window !== "undefined" ? window.location.hostname : "your domain";
      throw new Error(
        `Domain '${currentHost}' is not authorized for OAuth in Firebase. Please add '${currentHost}' to Authorized Domains in Firebase Console > Authentication > Settings > Authorized Domains.`
      );
    }
    if (error.code === "auth/operation-not-allowed") {
      throw new Error(
        "Google sign-in is not enabled in Firebase Console. Please enable 'Google' under Authentication > Sign-in method."
      );
    }
    throw error;
  }
};
