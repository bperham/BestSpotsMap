
'use client';

import {
  Auth,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createOrUpdateUserProfile } from '../firestore/users-service';

// --- Email & Password ---

export const signInWithPassword = (
  auth: Auth,
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const createAccount = async (
  auth: Auth,
  name: string,
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, {
        displayName: name,
    });
  }
  // Create user profile in Firestore
  const firestore = getFirestore(auth.app);
  await createOrUpdateUserProfile(firestore, userCredential.user);

  return userCredential;
};

// --- Social Providers ---

export const signInWithGoogle = async (auth: Auth): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  // Create user profile in Firestore
  const firestore = getFirestore(auth.app);
  await createOrUpdateUserProfile(firestore, userCredential.user);

  return userCredential;
};

// --- Profile & Sign Out ---

export const updateUserProfile = (
  auth: Auth,
  updates: { displayName?: string; photoURL?: string }
): Promise<void> => {
  if (!auth.currentUser) {
    return Promise.reject(new Error('No user is currently signed in.'));
  }
  return firebaseUpdateProfile(auth.currentUser, updates);
};

export const signOut = (auth: Auth): Promise<void> => {
  return firebaseSignOut(auth);
};
