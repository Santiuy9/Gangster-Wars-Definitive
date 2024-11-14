// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyeAX0QUdzY-gV-WEhc4OKjg3BecFtftc",
  authDomain: "guerra-de-pandillas-8afbb.firebaseapp.com",
  projectId: "guerra-de-pandillas-8afbb",
  storageBucket: "guerra-de-pandillas-8afbb.appspot.com",
  messagingSenderId: "997215216699",
  appId: "1:997215216699:web:48c05391d89f4e6943281e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

