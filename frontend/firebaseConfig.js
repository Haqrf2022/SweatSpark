import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBp8SunGXD0be7faKwAVsz9L-I8ZAuECOI",
  authDomain: "sweatspark.firebaseapp.com",
  projectId: "sweatspark",
  storageBucket: "sweatspark.appspot.com",
  messagingSenderId: "805574219797",
  appId: "1:805574219797:web:3ba55dcc701d5b4674961c",
  measurementId: "G-EHMSPXS1QY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
