
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Spot, User, User as UserProfile } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Camera, Bookmark, Eye, Globe, Edit, Map, Edit2, Trash2, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Timestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useFirestore, useUser as useAuthUser, useDoc } from '@/firebase';
import { StarRating } from './star-rating';
import { Separator } from '../ui/separator';
import { useMemo, useState } from 'react';
import { SubmitSpotDialog } from './submit-spot-dialog';
import { useRouter } from 'next/navigation';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { LoginGateDialog } from './login-gate-dialog';
import { deleteSpot, rateSpot, updateSpotDetails } from '@/firebase/firestore/spots-service';

interface SpotDetailSheetProps {
  spot: Spot | null;
  author: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToMap: () => void;
  onExploreSpot: (spot: Spot) => void;
  onEditLocation: (spot: Spot) => void;
  onSeeOnMap: (spot: Spot) => void;
}

function AdPlaceholder() {
    return (
      <div className="w-full p-4 text-center bg-muted/50 rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">Advertisement Placeholder</p>
      </div>
    );
  }

export function SpotDetailSheet({
  spot,
  author,
  open,
  onOpenChange,
  onBackToMap,
  onExploreSpot,
  onEditLocation,
  onSeeOnMap,
}: SpotDetailSheetProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: authUser } = useAuthUser();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoginGateOpen, setLoginGateOpen] = useState(false);
  const router = useRouter();

  const userProfileRef = useMemo(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  if (!spot) return null;
  
  const averageRating = (spot.ratingCount ?? 0) > 0 ? (spot.totalRating ?? 0) / spot.ratingCount! : 0;
  const userHasRated = authUser && spot.ratings && spot.ratings[authUser.uid];

  const streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${spot.location.lat},${spot.location.lng}&fov=${spot.location.fov}&heading=${spot.location.heading}&pitch=${spot.location.pitch}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  
  const handleExplore = () => {
    if (authUser) {
        onExploreSpot(spot);
        onOpenChange(false);
    } else {
        setLoginGateOpen(true);
    }
  };

  const handleSeeOnMapClick = () => {
    onSeeOnMap(spot);
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!firestore || !authUser) {
      setLoginGateOpen(true);
      return;
    }
    
    try {
      const userDocRef = doc(firestore, 'users', authUser.uid);
      await updateDoc(userDocRef, {
        favoriteSpotIds: arrayUnion(spot.id),
      });

      toast({
        title: 'View Favorited!',
        description: `"${spot.title}" has been added to your favorites.`,
      });
    } catch (error) {
      if (error instanceof Error && (error as any).code === 'not-found') {
          try {
              const { setDoc } = await import('firebase/firestore');
              const userDocRef = doc(firestore, 'users', authUser.uid);
              await setDoc(userDocRef, {
                  name: authUser.displayName,
                  email: authUser.email,
                  avatarUrl: authUser.photoURL,
                  favoriteSpotIds: [spot.id]
              });
              toast({
                  title: 'View Favorited!',
                  description: `"${spot.title}" has been added to your favorites.`,
              });
          } catch (e) {
              console.error('Error creating user document:', e);
              toast({
                  variant: 'destructive',
                  title: 'Favorite Failed',
                  description: 'Could not save the view.',
              });
          }
      } else {
          console.error('Error favoriting view:', error);
          toast({
              variant: 'destructive',
              title: 'Favorite Failed',
              description: 'Could not save the view.',
          });
      }
    }
  };
  
  const handleRatingChange = async (newRating: number) => {
    if (!firestore || !authUser) {
        setLoginGateOpen(true);
        return;
    }
    if (authUser.uid === spot.authorId) {
        toast({
            variant: 'destructive',
            title: 'Action Not Allowed',
            description: "You can't rate your own view.",
        });
        return;
    }

    try {
      await rateSpot(firestore, spot.id, authUser.uid, newRating);
      toast({
          title: 'Rating Submitted!',
          description: `You rated "${spot.title}" ${newRating} stars.`,
      });
    } catch (e: any) {
        console.error("Rating transaction failed: ", e);
        toast({
            variant: 'destructive',
            title: 'Rating Failed',
            description: e.message || 'There was a problem submitting your rating.',
        });
    }
  };

  const handleSpotEdit = async (editedSpotData: Partial<Omit<Spot, 'id' | 'authorId' | 'createdAt'>>) => {
    if (!firestore || !spot.id) return;
    try {
      await updateSpotDetails(firestore, spot.id, editedSpotData);
      toast({
        title: 'View Updated!',
        description: 'The view details have been saved.',
      });
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error.message || 'There was a problem updating the view.',
      });
    }
  };
  
  const handleLocationChangeClick = () => {
    if (spot) {
      onEditLocation(spot);
    }
  };

  const handleSpotDelete = async () => {
    if (!firestore || !spot.id) return;
    try {
      await deleteSpot(firestore, spot.id);
      toast({
        title: 'View Deleted',
        description: `"${spot.title}" has been removed.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Error',
        description: error.message || 'Could not delete the view.',
      });
    } finally {
        setDeleteDialogOpen(false);
        onOpenChange(false);
    }
  };

  const getDisplayDate = (createdAt: string | Timestamp) => {
    if (!createdAt) return '';
    let date;
    if (createdAt instanceof Timestamp) {
      date = createdAt.toDate();
    } else {
      date = new Date(createdAt);
    }
    if (isNaN(date.getTime())) {
      return 'a while ago';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const formatJurisdiction = () => {
    if (!spot?.jurisdiction) return null;
    const { city, state, country } = spot.jurisdiction;
    return [city, state, country].filter(Boolean).join(', ');
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
            className="sm:max-w-lg w-full p-0 flex flex-col"
            hideClose={true}
            >
            <SheetClose className="absolute left-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-10">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <SheetHeader className="p-6 pb-2">
                <div className="flex items-center gap-4 pr-8">
                    <SheetTitle className="font-headline text-2xl">{spot.title}</SheetTitle>
                    <StarRating rating={averageRating} totalRatings={spot.ratingCount} size={20} />
                </div>
              <SheetDescription>{spot.description}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-[3/2] w-full bg-muted">
                <img
                  src={streetViewImageUrl}
                  alt={`Street View of ${spot.title}`}
                  className="object-cover w-full h-full"
                  data-ai-hint="street view"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <Button
                    onClick={handleExplore}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
                    size="lg"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Explore in Street View
                </Button>
              </div>

              <div className="space-y-4 px-6 py-4">
                {author && (
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={author.avatarUrl} alt={author.name} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Spotted {getDisplayDate(spot.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Camera className="w-4 h-4"/>
                  <span>Category: <span className="font-semibold text-foreground capitalize">{spot.category}</span></span>
                </div>
                {spot.jurisdiction && formatJurisdiction() && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Location: <span className="font-semibold text-foreground">{formatJurisdiction()}</span></span>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {userHasRated ? 'Change Your Rating' : 'Rate This View'}
                    </h4>
                    <StarRating
                        rating={userHasRated ? spot.ratings![authUser!.uid] : 0}
                        isInteractive={!!authUser && authUser.uid !== spot.authorId}
                        onRatingChange={handleRatingChange}
                        size={28}
                    />
                    {!authUser && <p className="text-xs text-muted-foreground">You must be logged in to rate a view.</p>}
                     {authUser && authUser.uid === spot.authorId && <p className="text-xs text-muted-foreground">You cannot rate your own view.</p>}
                </div>
              </div>
            </div>
            <SheetFooter className="px-6 py-3 border-t bg-background">
                <div className="flex flex-col items-center w-full gap-2">
                    <div className="flex w-full gap-2">
                        <Button 
                            className="flex-1" 
                            onClick={handleSave}
                            style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}
                        >
                            <Bookmark className="mr-2 h-4 w-4" /> Add to Favorites
                        </Button>
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={handleSeeOnMapClick}
                        >
                            <Map className="mr-2 h-4 w-4" /> See on Map
                        </Button>
                    </div>
                    {userProfile?.role === 'admin' ? (
                        <div className="flex justify-center gap-2 pt-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditDialogOpen(true)}
                            >
                                <Edit className="mr-2 h-4 w-4" /> Edit Info
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleLocationChangeClick}
                            >
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Location
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete View
                            </Button>
                        </div>
                    ) : (
                        <AdPlaceholder />
                    )}
                </div>
            </SheetFooter>
        </SheetContent>
    </Sheet>
     <SubmitSpotDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSpotSubmit={handleSpotEdit}
        spotToEdit={spot}
        isEditMode={true}
      />
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleSpotDelete}
        itemTitle={spot.title}
        itemType="view"
      />
      <LoginGateDialog
        open={isLoginGateOpen}
        onOpenChange={setLoginGateOpen}
      />
    </>
  );
}
