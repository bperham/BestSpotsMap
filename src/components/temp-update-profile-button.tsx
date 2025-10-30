'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function TempUpdateProfileButton() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!auth || !auth.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: 'Updating Profile Picture...',
    });

    try {
      const newAvatarUrl = PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl;
      
      if (!newAvatarUrl) {
        throw new Error('New avatar image not found in placeholder data.');
      }

      await updateProfile(auth.currentUser, {
        photoURL: newAvatarUrl
      });
      
      toast({
        title: 'Success!',
        description: 'Your profile picture has been updated. You may need to refresh to see the change everywhere.',
      });

    } catch (error: any) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: error.message || "Could not update your profile picture.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!auth?.currentUser) return null;

  return (
    <Button onClick={handleUpdate} disabled={isLoading || !auth.currentUser} size="sm">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserCheck className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'Updating...' : 'Update My Pic'}
    </Button>
  );
}
