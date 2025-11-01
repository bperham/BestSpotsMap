
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Trash2, Loader2, Bookmark, ArrowLeft, Globe, Map, Edit, ShieldCheck, Star, CheckSquare, UserPlus, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, Timestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';
import type { Spot, User as UserProfile, Category, MapExtent, Feedback } from '@/lib/types';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitSpotDialog } from '@/components/spots/submit-spot-dialog';
import { DeleteConfirmationDialog } from '@/components/spots/delete-confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HomeLocationDialog } from '@/components/profile/home-location-dialog';
import { updateSpotDetails, deleteSpot, approveSpot } from '@/firebase/firestore/spots-service';
import { cn } from '@/lib/utils';
import { createOrUpdateUserProfile, updateUserProfile } from '@/firebase/firestore/users-service';
import { SortControl, type SortMethod } from '@/components/profile/sort-control';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { FeedbackDialog } from '@/components/profile/feedback-dialog';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { formatDistanceToNow } from 'date-fns';
import { deleteFeedback } from '@/firebase/firestore/feedback-service';


const categoryEmojis: Record<Category, string> = {
    interesting: '🤔',
    funny: '😂',
    strange: '👽',
    cool: '😎',
    creepy: '👻',
    beautiful: '😍',
    people: '👥',
    buildings: '🏢',
    nature: '🌈',
    art: '🎨',
    glitch: '🤖',
    architecture: '🏛️',
    abandoned: '🏚️',
};

function useAuthors(authorIds: string[]) {
    const firestore = useFirestore();
    const [authors, setAuthors] = useState<Record<string, UserProfile>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore || authorIds.length === 0) {
            setLoading(false);
            return;
        }

        const uniqueIds = [...new Set(authorIds)];
        const authorsCollection = collection(firestore, 'users');
        const q = query(authorsCollection, where('__name__', 'in', uniqueIds));
        
        const unsubscribe = getDocs(q)
            .then(querySnapshot => {
                const fetchedAuthors: Record<string, UserProfile> = {};
                querySnapshot.forEach(doc => {
                    fetchedAuthors[doc.id] = { id: doc.id, ...doc.data() } as UserProfile;
                });
                setAuthors(fetchedAuthors);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching authors:", error);
                setLoading(false);
            });

    }, [firestore, authorIds]);

    return { authors, loading };
}


function AuthorDisplay({ author }: { author: UserProfile | null | undefined }) {
    if (!author) {
        return (
             <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
             </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
                {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt={author.name} />}
                <AvatarFallback className="text-xs">{author.name ? author.name.charAt(0) : '?'}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{author.name || 'Unknown Author'}</span>
        </div>
    );
}

function SpotCard({ spot, isOwner, isAdmin, onApprove, author }: { spot: Spot, isOwner: boolean, isAdmin: boolean, onApprove?: (spotId: string) => void, author?: UserProfile | null }) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const getDisplayDate = (createdAt: string | Timestamp) => {
    if (!createdAt) return '';
    if (createdAt instanceof Timestamp) {
      return createdAt.toDate().toLocaleDateString();
    }
    return new Date(createdAt).toLocaleDateString();
  };

  const formatJurisdiction = () => {
    if (!spot?.jurisdiction) return null;
    const { city, state, country } = spot.jurisdiction;
    return [city, state, country].filter(Boolean).join(', ');
  }
  
  const handleSpotEdit = async (editedSpotData: Partial<Omit<Spot, 'id' | 'authorId' | 'createdAt'>>) => {
    if (!firestore || !spot.id) return;
    try {
      await updateSpotDetails(firestore, spot.id, editedSpotData);
      toast({
        title: 'View Updated!',
        description: 'Your view details have been saved.',
      });
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error.message || 'There was a problem updating your view.',
      });
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
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Error',
        description: error.message || 'Could not delete the view.',
      });
    }
  };

  const handleLocationChangeClick = () => {
    if (spot.id) {
      router.push(`/?editLocation=${spot.id}`);
    }
  };

  const handleApproveClick = () => {
    if (onApprove && spot.id) {
      onApprove(spot.id);
    }
  }

  const goToSpotUrl = `/?lat=${spot.location.lat}&lng=${spot.location.lng}&heading=${spot.location.heading}&pitch=${spot.location.pitch}&fov=${spot.location.fov}`;

  return (
    <>
      <Card className="flex flex-col sm:flex-row overflow-hidden">
        <div className="relative h-40 sm:h-auto sm:w-48 flex-shrink-0 bg-muted">
          <img
            src={`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${spot.location.lat},${spot.location.lng}&heading=${spot.location.heading}&pitch=${spot.location.pitch}&fov=${spot.location.fov}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            alt={spot.title}
            className="object-cover w-full h-full"
            data-ai-hint="street view"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400/212939/94a3b8?text=No+Image';
              target.alt = 'Street view not available';
            }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <CardHeader className="py-3 px-4">
            <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-headline">{spot.title}</CardTitle>
              <Badge variant="secondary" className="capitalize flex-shrink-0">
                <span className="mr-1.5 text-base" role="img">{categoryEmojis[spot.category]}</span>
                {spot.category}
              </Badge>
            </div>
            <CardDescription className="line-clamp-1 text-xs">{spot.description}</CardDescription>
          </CardHeader>
          <CardContent className="py-3 px-4 text-xs text-muted-foreground space-y-2">
            {spot.jurisdiction && formatJurisdiction() && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span>{formatJurisdiction()}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <AuthorDisplay author={author} />
                </div>
              <div className="flex items-center gap-2">
                <Camera className="w-3 h-3" />
                <span>{getDisplayDate(spot.createdAt)}</span>
              </div>
            </div>
          </CardContent>
          <div className="p-3 px-4 flex gap-2 flex-wrap">
             <Button asChild variant="outline" size="sm">
                <Link href={goToSpotUrl}>
                    <Map className="mr-2 h-4 w-4" /> Go to View
                </Link>
             </Button>
            {(isOwner || isAdmin) && (
                <>
                    <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>Edit Info</Button>
                    <Button variant="outline" size="sm" onClick={handleLocationChangeClick}><Edit className="mr-2 h-4 w-4" />Edit Location</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                </>
            )}
            {isAdmin && onApprove && spot.authorId !== 'admin-user-id' && ( // Add a placeholder admin id
                 <Button onClick={handleApproveClick} size="sm">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Approve
                 </Button>
            )}
          </div>
        </div>
      </Card>
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
    </>
  );
}


function CreateProfileButton() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProfile = async () => {
        if (!firestore || !user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to create a profile.',
            });
            return;
        }

        setIsCreating(true);
        try {
            await createOrUpdateUserProfile(firestore, user);
            toast({
                title: 'Profile Created!',
                description: 'Your profile has been successfully created. The page will now reload.',
            });
            // Give toast time to show before reload
            setTimeout(() => window.location.reload(), 2000);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Profile Creation Failed',
                description: error.message || 'There was a problem creating your profile.',
            });
            setIsCreating(false);
        }
    };
    
    return (
        <div className="container max-w-5xl py-8 text-center">
            <h2 className="text-2xl font-bold font-headline">Create Your Profile</h2>
            <p className="text-muted-foreground mt-2">
                It looks like you're logged in, but your user profile hasn't been created yet.
            </p>
            <Button className="mt-4" onClick={handleCreateProfile} disabled={isCreating}>
                {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isCreating ? 'Creating Profile...' : 'Create My Profile'}
            </Button>
        </div>
    );
}

const getSortableDate = (createdAt: string | Timestamp): number => {
    if (createdAt instanceof Timestamp) {
      return createdAt.toMillis();
    }
    // Attempt to parse the string as a date.
    const date = new Date(createdAt);
    // If parsing fails, return 0 to avoid crashing, placing it at the start.
    return isNaN(date.getTime()) ? 0 : date.getTime();
};

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [favoriteSpots, setFavoriteSpots] = useState<Spot[]>([]);
  const [favoriteSpotsLoading, setFavoriteSpotsLoading] = useState(true);
  const [isHomeEditorOpen, setHomeEditorOpen] = useState(false);
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const [isFeedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const { toast } = useToast();
  const [sortMethod, setSortMethod] = useState<SortMethod>('date-desc');


  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const isAdmin = true;

  const userSpotsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'spots'), where('authorId', '==', user.uid));
  }, [firestore, user]);

  const { data: userSpots, loading: spotsLoading } = useCollection<Spot>(userSpotsQuery);

  const pendingSpotsQuery = useMemo(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'spots'), where('isApproved', '==', false));
  }, [firestore, isAdmin]);

  const { data: pendingSpots, loading: pendingSpotsLoading } = useCollection<Spot>(pendingSpotsQuery);
  

  const handleSetHomeLocation = async (homeLocation: MapExtent) => {
    if (!userProfileRef) return;
    try {
      await updateDoc(userProfileRef, { homeLocation });
      toast({
        title: 'Home Location Set!',
        description: 'Your default map location has been updated.',
      });
      setHomeEditorOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not save home location.',
      });
    }
  };

  const handleProfileUpdate = async (data: { name: string; bio: string }) => {
    if (!firestore || !user || !auth) return;
    try {
      // Update Firestore document
      await updateUserProfile(firestore, user.uid, { name: data.name, bio: data.bio });
      
      // Update auth profile
      if (user.displayName !== data.name) {
        if(auth.currentUser) {
          await updateAuthProfile(auth.currentUser, { displayName: data.name });
        }
      }

      toast({
        title: 'Profile Updated',
        description: 'Your name and bio have been successfully updated.',
      });
      setProfileEditorOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'There was a problem updating your profile.',
      });
    }
  };

  const handleApproveSpot = async (spotId: string) => {
    if (!firestore) return;
    try {
      await approveSpot(firestore, spotId);
      toast({
        title: 'View Approved',
        description: 'The view is now public.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Approval Error',
        description: error.message || 'There was a problem approving the view.',
      });
    }
  };


  useEffect(() => {
    const fetchFavoriteSpots = async () => {
      if (!firestore || !userProfile?.favoriteSpotIds || userProfile.favoriteSpotIds.length === 0) {
        setFavoriteSpots([]);
        setFavoriteSpotsLoading(false);
        return;
      }
      
      setFavoriteSpotsLoading(true);
      try {
        const spotIds = userProfile.favoriteSpotIds;
        const spots: Spot[] = [];
        // Firestore 'in' queries are limited to 30 items.
        // We chunk the spotIds array to handle more than 30 favorites.
        for (let i = 0; i < spotIds.length; i += 30) {
          const chunk = spotIds.slice(i, i + 30);
          if (chunk.length > 0) {
            const spotsQuery = query(collection(firestore, "spots"), where("__name__", "in", chunk));
            const querySnapshot = await getDocs(spotsQuery);
            const chunkSpots = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id } as Spot));
            spots.push(...chunkSpots);
          }
        }
        setFavoriteSpots(spots);

      } catch (error) {
        console.error("Error fetching favorite spots:", error);
      } finally {
        setFavoriteSpotsLoading(false);
      }
    };
    if (userProfile && firestore) {
      fetchFavoriteSpots();
    }
  }, [firestore, userProfile]);
  
  const loading = userLoading || profileLoading || (user && !profileLoading && !userProfile);

  const sortedUserSpots = useMemo(() => {
    if (!userSpots) return [];
    return [...userSpots].sort((a, b) => {
      switch (sortMethod) {
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return getSortableDate(a.createdAt) - getSortableDate(b.createdAt);
        case 'date-desc':
        default:
          return getSortableDate(b.createdAt) - getSortableDate(a.createdAt);
      }
    });
  }, [userSpots, sortMethod]);

  const sortedFavoriteSpots = useMemo(() => {
    if (!favoriteSpots) return [];
    return [...favoriteSpots].sort((a, b) => {
      switch (sortMethod) {
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
            return getSortableDate(a.createdAt) - getSortableDate(b.createdAt);
        case 'date-desc':
        default:
            return getSortableDate(b.createdAt) - getSortableDate(a.createdAt);
      }
    });
  }, [favoriteSpots, sortMethod]);

  const sortedPendingSpots = useMemo(() => {
    if (!pendingSpots) return [];
    return [...pendingSpots].sort((a, b) => {
      switch (sortMethod) {
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
            return getSortableDate(a.createdAt) - getSortableDate(b.createdAt);
        case 'date-desc':
        default:
            return getSortableDate(b.createdAt) - getSortableDate(a.createdAt);
      }
    });
  }, [pendingSpots, sortMethod]);
  
  const allAuthorIds = useMemo(() => {
    const ids = new Set<string>();
    if (userSpots) userSpots.forEach(spot => ids.add(spot.authorId));
    if (favoriteSpots) favoriteSpots.forEach(spot => ids.add(spot.authorId));
    if (pendingSpots) pendingSpots.forEach(spot => ids.add(spot.authorId));
    return Array.from(ids);
  }, [userSpots, favoriteSpots, pendingSpots]);

  const { authors, loading: authorsLoading } = useAuthors(allAuthorIds);

  if (userLoading || (user && profileLoading)) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-5xl py-8 text-center">
        <h2 className="text-2xl font-bold font-headline">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You must be logged in to view your profile.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  if (!userProfile) {
    return <CreateProfileButton />;
  }
  
  const contentLoading = spotsLoading || favoriteSpotsLoading || (isAdmin && pendingSpotsLoading) || authorsLoading;


  const getUserLevel = () => {
    if (isAdmin) {
      return { name: 'Admin', icon: <ShieldCheck className="w-4 h-4 text-green-500" /> };
    }
    if ((userSpots?.length || 0) >= 50) {
      return { name: 'Veteran Spotter', icon: <Star className="w-4 h-4 text-yellow-500" /> };
    }
    return { name: 'Casual Spotter', icon: <Camera className="w-4 h-4 text-blue-500" /> };
  };

  const userLevel = getUserLevel();


  return (
    <>
    <div className="container max-w-5xl py-8">
      <div className="space-y-8">
        <div className="mb-6 flex justify-between items-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-2 ring-primary">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ''} />}
            <AvatarFallback className="text-3xl">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-headline tracking-tight">
                {userProfile.name}
              </h1>
              <Badge variant="outline" className="flex items-center gap-2 py-1 px-3 text-sm">
                {userLevel.icon}
                <span className="font-semibold">{userLevel.name}</span>
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="mt-2 max-w-prose">
              {userProfile.bio || 'No bio yet. Click Edit Profile to add one!'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setProfileEditorOpen(true)}>Edit Profile</Button>
              <Button variant="outline" onClick={() => setHomeEditorOpen(true)}>
                  Edit Home Location
              </Button>
               <Button variant="outline" onClick={() => setFeedbackDialogOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Give Feedback
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="added" className="w-full">
          <TabsList className={cn("gap-2")}>
            <TabsTrigger value="added">Added Views ({userSpots?.length || 0})</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Views ({favoriteSpots?.length || 0})</TabsTrigger>
            {isAdmin && <TabsTrigger value="pending">Pending ({pendingSpots?.length || 0})</TabsTrigger>}
          </TabsList>
            {contentLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                  <TabsContent value="added" className="mt-4 space-y-4">
                     <SortControl onSortChange={setSortMethod} sortMethod={sortMethod} />
                     <div className="grid gap-4">
                      {sortedUserSpots.map((spot) => (
                        <SpotCard key={spot.id} spot={spot} isOwner={true} isAdmin={isAdmin} author={authors[spot.authorId]} />
                      ))}
                      {sortedUserSpots.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                          <h3 className="text-lg font-medium">No Views Yet</h3>
                          <p className="text-muted-foreground mt-1">You haven't submitted any views. Go explore!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="favorites" className="mt-4 space-y-4">
                    <SortControl onSortChange={setSortMethod} sortMethod={sortMethod} />
                    {sortedFavoriteSpots.length > 0 ? (
                        <div className="grid gap-4">
                            {sortedFavoriteSpots.map((spot) => (
                               <SpotCard key={spot.id} spot={spot} isOwner={user?.uid === spot.authorId} isAdmin={isAdmin} author={authors[spot.authorId]} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2"/>
                            <h3 className="text-lg font-medium">No Favorite Views Yet</h3>
                            <p className="text-muted-foreground mt-1">Views you favorite will appear here.</p>
                        </div>
                    )}
                  </TabsContent>
                  {isAdmin && (
                    <TabsContent value="pending" className="mt-4 space-y-4">
                      <SortControl onSortChange={setSortMethod} sortMethod={sortMethod} />
                      {sortedPendingSpots.length > 0 ? (
                          <div className="grid gap-4">
                              {sortedPendingSpots.map((spot) => (
                                 <SpotCard key={spot.id} spot={spot} isOwner={user?.uid === spot.authorId} isAdmin={true} onApprove={handleApproveSpot} author={authors[spot.authorId]} />
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-12 border-2 border-dashed rounded-lg">
                              <CheckSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2"/>
                              <h3 className="text-lg font-medium">No Pending Views</h3>
                              <p className="text-muted-foreground mt-1">There are no new views to review right now.</p>
                          </div>
                      )}
                    </TabsContent>
                  )}
                </>
            )}
        </Tabs>
      </div>
    </div>
    <HomeLocationDialog 
      open={isHomeEditorOpen}
      onOpenChange={setHomeEditorOpen}
      currentLocation={userProfile?.homeLocation}
      onSave={handleSetHomeLocation}
    />
    <EditProfileDialog
        open={isProfileEditorOpen}
        onOpenChange={setProfileEditorOpen}
        currentUser={userProfile}
        onSave={handleProfileUpdate}
    />
    <FeedbackDialog
      open={isFeedbackDialogOpen}
      onOpenChange={setFeedbackDialogOpen}
      user={userProfile}
    />
    </>
  );
}
