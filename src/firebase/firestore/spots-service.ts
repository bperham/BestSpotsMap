
'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import type { LocationAndPano, Spot } from '@/lib/types';
import { spots as defaultSpots } from '@/lib/data';
import {
    FirestorePermissionError,
    type SecurityRuleContext,
  } from '../errors';
import { errorEmitter } from '../error-emitter';

type NewSpotData = Omit<Spot, 'id' | 'authorId' | 'createdAt' | 'ratingCount' | 'totalRating' | 'ratings'>;
type EditSpotData = Partial<Omit<Spot, 'id' | 'authorId' | 'createdAt'>>;

export const submitNewSpot = (
  firestore: Firestore,
  userId: string,
  spotData: NewSpotData
) => {
  const spotsCollection = collection(firestore, 'spots');
  return addDoc(spotsCollection, {
    ...spotData,
    authorId: userId,
    createdAt: serverTimestamp(),
    isApproved: false,
    ratingCount: 0,
    totalRating: 0,
    ratings: {},
  });
};

export const updateSpotDetails = (
  firestore: Firestore,
  spotId: string,
  spotData: EditSpotData
) => {
  const spotRef = doc(firestore, 'spots', spotId);
  return updateDoc(spotRef, spotData);
};

export const updateSpotLocation = (
  firestore: Firestore,
  spotId: string,
  location: LocationAndPano
) => {
  const spotRef = doc(firestore, 'spots', spotId);
  return updateDoc(spotRef, { location });
};

export const deleteSpot = (firestore: Firestore, spotId: string) => {
  const spotRef = doc(firestore, 'spots', spotId);
  return deleteDoc(spotRef);
};

export const approveSpot = (firestore: Firestore, spotId: string) => {
  const spotRef = doc(firestore, 'spots', spotId);
  return updateDoc(spotRef, { isApproved: true });
};


export const seedDatabaseWithSpots = (firestore: Firestore, userId: string) => {
  const batch = writeBatch(firestore);
  const spotsCollection = collection(firestore, 'spots');
  defaultSpots.forEach((spot) => {
    const { id, ...spotData } = spot; // exclude mock ID
    const docRef = doc(spotsCollection); // Create a new doc ref
    batch.set(docRef, { 
        ...spotData, 
        authorId: userId,
        isApproved: false 
    });
  });
  return batch.commit();
};

export const rateSpot = async (
    firestore: Firestore,
    spotId: string,
    userId: string,
    newRating: number
  ) => {
    const spotRef = doc(firestore, 'spots', spotId);
  
    try {
        await runTransaction(firestore, async (transaction) => {
            const spotDoc = await transaction.get(spotRef);
            if (!spotDoc.exists()) {
              throw new Error('Spot does not exist!');
            }
        
            const spotData = spotDoc.data() as Spot;
            const currentRatings = spotData.ratings || {};
            const oldRating = currentRatings[userId];
        
            let newTotalRating = (spotData.totalRating || 0) + newRating;
            let newRatingCount = spotData.ratingCount || 0;
        
            if (oldRating !== undefined) {
              newTotalRating -= oldRating;
            } else {
              newRatingCount += 1;
            }
        
            const newRatingsMap = { ...currentRatings, [userId]: newRating };
        
            transaction.update(spotRef, {
              ratings: newRatingsMap,
              totalRating: newTotalRating,
              ratingCount: newRatingCount,
            });
        });
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: spotRef.path,
                operation: 'update',
                requestResourceData: {
                    ratings: '...',
                    totalRating: '...',
                    ratingCount: '...',
                  },
              } satisfies SecurityRuleContext);
              errorEmitter.emit('permission-error', permissionError);
        }
        throw e;
    }
  };
