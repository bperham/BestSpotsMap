'use client';

import { useState } from 'react';
import { writeBatch, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand } from 'lucide-react';
import { spots as newSpots } from '@/lib/new-spots';

export function TempSeedButton() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAndSeed = async () => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to modify spots.',
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: 'Starting Update...',
      description: 'Assigning all spots and admin role to your account. This may take a moment.',
    });

    try {
      const batch = writeBatch(firestore);
      const spotsCollection = collection(firestore, 'spots');
      
      // 1. Fetch all existing spots
      const querySnapshot = await getDocs(spotsCollection);
      
      // 2. Update authorId for all existing spots
      querySnapshot.forEach(docSnap => {
        const spotRef = doc(firestore, 'spots', docSnap.id);
        batch.update(spotRef, { authorId: user.uid });
      });

      // 3. Add the 10 new spots with the correct authorId
      newSpots.forEach(spot => {
        const { id, authorId, ...spotData } = spot; // Exclude mock ID and old authorId
        const docRef = doc(spotsCollection); // Create a new doc ref
        batch.set(docRef, { ...spotData, authorId: user.uid });
      });

      // 4. Set the user's role to admin
      const userRef = doc(firestore, 'users', user.uid);
      // Use set with merge: true to create or update the user document
      batch.set(userRef, { role: 'admin' }, { merge: true });

      await batch.commit();
      
      toast({
        title: 'Success!',
        description: `You are now an admin, all spots assigned to you, and ${newSpots.length} new spots added.`,
      });

    } catch (error: any) {
      console.error("Error updating and seeding database: ", error);
      toast({
        variant: "destructive",
        title: "Update & Seed Error",
        description: error.message || "Could not update and add spots.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleUpdateAndSeed} disabled={isLoading || !user} size="sm">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'Updating...' : 'Claim All & Become Admin'}
    </Button>
  );
}
