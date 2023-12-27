import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import type { FirebaseError } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyA9-57BO4ucdukCossGHWj2PHdnslMYCVs",
  authDomain: "umw-cribs.firebaseapp.com",
  projectId: "umw-cribs",
  storageBucket: "umw-cribs.appspot.com",
  messagingSenderId: "600080355821",
  appId: "1:600080355821:web:fed6d20795566c8b1157e4",
  measurementId: "G-MJJK3LRZQP",
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)

export function parseFireBaseError(error: FirebaseError) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email address is already in use."
    case "auth/invalid-email":
      return "This email address is invalid."
    case "auth/user-disabled":
      return "This email address is disabled by the administrator."
    case "auth/user-not-found":
      return "This email address is not registered."
    case "auth/invalid-login-credentials":
      return "The password is invalid or the user does not have a password."
    default:
      return error.message
  }
}
