import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBX9CaAmDNNB_rctvZY459iY9XuQZU8Kr4",
  authDomain: "usm2025-d00bb.firebaseapp.com",
  projectId: "usm2025-d00bb",
  storageBucket: "usm2025-d00bb.firebasestorage.app",
  messagingSenderId: "705726202925",
  appId: "1:705726202925:web:66de36516d9135f5e4e4a4",
  measurementId: "G-3GK22GVZDS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
