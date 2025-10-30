
'use server';
/**
 * @fileOverview A flow for handling user feedback submissions.
 *
 * - sendFeedback - A function that processes the feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { User } from '@/lib/types';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';


// We only need a subset of user properties for feedback
const FeedbackUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const FeedbackInputSchema = z.object({
  user: FeedbackUserInputSchema,
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(1, 'Message is required.'),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

const feedbackFlow = ai.defineFlow(
  {
    name: 'feedbackFlow',
    inputSchema: FeedbackInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (feedback) => {
    // To integrate with Google Workspace, you would use the Gmail API here.
    // This would involve setting up OAuth 2.0, installing the `googleapis` npm package,
    // and using an authenticated client to send an email.
    try {
        const { firestore } = initializeFirebase();
        if (!firestore) {
            throw new Error('Firestore is not initialized.');
        }
        const feedbackCollection = collection(firestore, 'feedback');
        await addDoc(feedbackCollection, {
            ...feedback,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to save feedback to Firestore:', error);
        // We return success: false to the client if the database operation fails.
        return { success: false };
    }
  }
);

export async function sendFeedback(feedback: FeedbackInput): Promise<{ success: boolean }> {
  return await feedbackFlow(feedback);
}
