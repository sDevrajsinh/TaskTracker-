// src/firebase/auth.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './config';

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  return signOut(auth);
}
