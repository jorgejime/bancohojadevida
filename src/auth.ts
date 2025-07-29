import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import Firestore instance

const auth = getAuth();

export const register = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // After creating the user, create a document in Firestore to store jejich role
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user" // Default role
  });

  return userCredential;
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};

export const getCurrentUserRole = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  
  return null;
};

export const isAuthenticated = () => {
    return auth.currentUser !== null;
};

export const getUserName = () => {
    return auth.currentUser?.displayName || auth.currentUser?.email || 'Usuario';
};

export { onAuthStateChanged, auth };
