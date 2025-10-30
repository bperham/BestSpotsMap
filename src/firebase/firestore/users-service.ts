
'use client';

import {
  doc,
  Firestore,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DEFAULT_GLOBE_EXTENT = { center: { lat: 0, lng: 0 }, zoom: 2 };

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * This is useful for initializing user data on their first sign-in.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export const createOrUpdateUserProfile = async (
  firestore: Firestore,
  user: FirebaseUser
) => {
  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // User document doesn't exist, so create it.
    const { displayName, email, photoURL } = user;
    
    // Select a random abstract avatar
    const abstractAvatars = PlaceHolderImages.filter(img => img.imageHint.includes('abstract'));
    const randomAvatar = abstractAvatars.length > 0
      ? abstractAvatars[Math.floor(Math.random() * abstractAvatars.length)]
      : { imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' };


    try {
      await setDoc(userRef, {
        name: displayName || 'Anonymous User',
        email: email,
        avatarUrl: photoURL || randomAvatar.imageUrl,
        bio: 'Explorer of digital worlds and connoisseur of curious corners on Street View.',
        favoriteSpotIds: [],
        role: 'user', // Default role
        homeLocation: DEFAULT_GLOBE_EXTENT,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      // We can re-throw or handle it as needed
      throw error;
    }
  }
  // If the document exists, we can optionally update it with fresh info from the auth provider
  // For now, we'll just ensure it's created on the first sign-in.
};

export const updateUserProfile = async (
    firestore: Firestore,
    userId: string,
    data: { name?: string; bio?: string }
  ) => {
    const userRef = doc(firestore, 'users', userId);
    return updateDoc(userRef, data);
};
