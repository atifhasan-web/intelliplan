import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studyflow-h3acw",
  "appId": "1:885793282538:web:9d6e5351bc954af285fa93",
  "storageBucket": "studyflow-h3acw.firebasestorage.app",
  "apiKey": "AIzaSyBG4pZtCIaBiDB6nUcHF-orTTUJZoc8AM4",
  "authDomain": "studyflow-h3acw.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "885793282538"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
