import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
// Yksinkertaistetaan auth ilman persistence-asetuksia
import { getAuth } from "firebase/auth";
// Tuodaan uusi muistipaketti
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjXx5TS0j20Wkq8xl_gJDqkIOChzpo_AY",
  authDomain: "kaloripoliisi-7bc3c.firebaseapp.com",
  projectId: "kaloripoliisi-7bc3c",
  storageBucket: "kaloripoliisi-7bc3c.firebasestorage.app",
  messagingSenderId: "529769381506",
  appId: "1:529769381506:web:d121c1e71a5bb096f5be9b",
  measurementId: "G-HPHXY03XQW"
};

const app = initializeApp(firebaseConfig);
const firestore: Firestore = getFirestore(app);

// Alustetaan Auth yksinkertaisesti
const auth = getAuth(app);

export { firestore, auth };