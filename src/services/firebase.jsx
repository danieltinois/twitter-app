import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Importe getDatabase para acessar o Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyC3yMg0Q18juCiyiGC5pPU8FBObPefBkQs",

  authDomain: "twitter-clone-app-9e6f7.firebaseapp.com",

  databaseURL: "https://twitter-clone-app-9e6f7-default-rtdb.firebaseio.com",

  projectId: "twitter-clone-app-9e6f7",

  storageBucket: "twitter-clone-app-9e6f7.appspot.com",

  messagingSenderId: "849889391805",

  appId: "1:849889391805:web:dd61830aa3158132ce73d4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app); // Obtenha uma instância do Realtime Database
