import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA8f_MTYbj_CKzUiJMMDFbyiO0JLqhL6tI",
  authDomain: "mediaplayer-5d03d.firebaseapp.com",
  projectId: "mediaplayer-5d03d",
  storageBucket: "mediaplayer-5d03d.appspot.com",
  messagingSenderId: "636902931378",
  appId: "1:636902931378:web:fe0dffd7b74890985e82ab"
};

const app = initializeApp(firebaseConfig);

export default app