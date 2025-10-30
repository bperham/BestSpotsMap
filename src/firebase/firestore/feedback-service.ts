
'use client';

import {
  deleteDoc,
  doc,
  Firestore,
} from 'firebase/firestore';

export const deleteFeedback = (firestore: Firestore, feedbackId: string) => {
  const feedbackRef = doc(firestore, 'feedback', feedbackId);
  return deleteDoc(feedbackRef);
};
