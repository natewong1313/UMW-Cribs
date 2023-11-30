import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdPzYQM23E1VjQbzDe8YtPIlBnkri9XWE",
  authDomain: "web-app-template-65ab7.firebaseapp.com",
  projectId: "web-app-template-65ab7",
  storageBucket: "web-app-template-65ab7.appspot.com",
  messagingSenderId: "534366829913",
  appId: "1:534366829913:web:8d0aa973512fbe16c26048",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
