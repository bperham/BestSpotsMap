'use client';

import {
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useState, useMemo, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Spot, Category, SpotType, User as UserProfile, MapExtent } from '@/lib/types';
import { SpotDetailSheet } from '@/components/spots/spot-detail-sheet';
import {
    PlusCircle,
    Loader2,
    CheckCircle,
    Info,
    XCircle,
  } from 'lucide-react';
import { SubmitSpotDialog } from '../spots/submit-spot-dialog';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { users as mockUsers } from '@/lib/data'; // Keep for author fallback
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MapSearchBox } from './map-search-box';
import {
    seedDatabaseWithSpots,
    submitNewSpot,
    updateSpotLocation,
} from '@/firebase/firestore/spots-service';
import { MapTypeControl } from './map-type-control';

export type LocationAndPano = {
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  fov: number;
};

interface MapViewProps {
  categoryFilter?: Category | 'all';
  spotTypeFilter?: SpotType;
  searchQuery?: string;
  goToRandomSpot?: Spot | null;
  onFilteredSpotsChange?: (spots: Spot[]) => void;
  zoomToResults?: boolean;
  onMapExtentChange?: (extent: MapExtent) => void;
  targetExtent?: MapExtent;
  navigationAction?: 'pan' | 'back' | 'forward' | 'home' | 'globe' | null;
  onStreetViewChange?: (isActive: boolean) => void;
  onPan?: () => void;
  mapTypeId?: google.maps.MapTypeId;
  onMapTypeIdChange?: (mapTypeId: google.maps.MapTypeId) => void;
  spots: Spot[] | null;
  spotsLoading: boolean;
}

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


const MapView = forwardRef(({ 
  categoryFilter = 'all', 
  spotTypeFilter = 'all', 
  searchQuery = '',
  goToRandomSpot,
  onFilteredSpotsChange,
  zoomToResults,
  onMapExtentChange,
  targetExtent,
  navigationAction,
  onStreetViewChange,
  onPan,
  mapTypeId,
  onMapTypeIdChange,
  spots,
  spotsLoading,
}: MapViewProps, ref) => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [spotToEdit, setSpotToEdit] = useState<Spot | null>(null);
  
  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [currentPano, setCurrentPano] = useState<LocationAndPano | null>(null);
  const [isStreetViewActive, setStreetViewActive] = useState(false);
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isDetailSheetVisible, setDetailSheetVisible] = useState(true);

  
  const [spotIdToUpdate, setSpotIdToUpdate] = useState<string | null>(null);
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const { toast } = useToast();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const isPickingLocation = !!spotIdToUpdate;

  useImperativeHandle(ref, () => ({
    handleBackToMap,
    handleExploreSpot,
  }));

  useEffect(() => {
    const spotIdFromUrl = searchParams.get('editLocation');
    if (spotIdFromUrl && spots) {
      const spotFromUrl = spots.find(s => s.id === spotIdFromUrl);
      if (spotFromUrl) {
        setSpotToEdit(spotFromUrl);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('editLocation');
        router.replace(newUrl.toString(), { scroll: false });
      }
    }
  }, [searchParams, spots, router]);
  
  useEffect(() => {
    if (map && targetExtent && navigationAction) {
        map.moveCamera({ center: targetExtent.center, zoom: targetExtent.zoom });
    }
  }, [map, targetExtent, navigationAction]);
  
  useEffect(() => {
    if (spotToEdit && map) {
      handleEditLocationStart(spotToEdit);
      setSpotToEdit(null); // Reset after initiating
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotToEdit, map]);

  const handleExploreSpot = useCallback((spot: Spot) => {
    if (!map) return;

    map.setCenter(spot.location);
    map.setZoom(10);
    
    const panorama = map.getStreetView();
    if (!panorama) return;

    panorama.setPosition(spot.location);
    panorama.setPov({
      heading: spot.location.heading,
      pitch: spot.location.pitch,
    });
    panorama.setZoom(1);
    panorama.setVisible(true);
    setSelectedSpot(spot);
    setDetailSheetVisible(true);
  }, [map]);

  useEffect(() => {
    if (goToRandomSpot && map) {
      handleExploreSpot(goToRandomSpot);
    }
  }, [goToRandomSpot, map, handleExploreSpot]);
  
   useEffect(() => {
    if (spotsLoading || !spots || !map) return;

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const heading = searchParams.get('heading');
    const pitch = searchParams.get('pitch');

    if (lat && lng && heading && pitch) {
      const targetSpot = spots.find(spot => 
        spot.location.lat.toString() === lat &&
        spot.location.lng.toString() === lng &&
        spot.location.heading.toString() === heading &&
        spot.location.pitch.toString() === pitch
      );

      if (targetSpot) {
        handleExploreSpot(targetSpot);
        
        if (onStreetViewChange) {
            onStreetViewChange(true);
        }
        setStreetViewActive(true);

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('lat');
        newUrl.searchParams.delete('lng');
        newUrl.searchParams.delete('heading');
        newUrl.searchParams.delete('pitch');
        newUrl.searchParams.delete('fov');
        newUrl.searchParams.delete('zoom');
        router.replace(newUrl.toString(), { scroll: false });
      }
    }
  }, [searchParams, spots, spotsLoading, map, router, handleExploreSpot, onStreetViewChange]);


  useEffect(() => {
    if (!map) return;
    const panorama = map.getStreetView();
    if (!panorama) return;

    const panoVisibleListener = panorama.addListener('visible_changed', () => {
      const isVisible = panorama.getVisible();
      setStreetViewActive(isVisible);
      if (onStreetViewChange) {
        onStreetViewChange(isVisible);
      }
      if (isVisible) {
        updatePanoData();
      } else if (!isPickingLocation) {
        setCurrentPano(null);
      }
    });

    const panoChangeListener = panorama.addListener('position_changed', () => {
      if (panorama.getVisible()) updatePanoData();
    });

    const povChangeListener = panorama.addListener('pov_changed', () => {
      if (panorama.getVisible()) updatePanoData();
    });

    const updatePanoData = () => {
      const panoLocation = panorama.getPosition();
      const pov = panorama.getPov();
      if (panoLocation && pov) {
        setCurrentPano({
          lat: panoLocation.lat(),
          lng: panoLocation.lng(),
          heading: pov.heading,
          pitch: pov.pitch,
          fov: 180 / Math.pow(2, panorama.getZoom() || 1),
        });
      }
    };

    return () => {
      panoVisibleListener.remove();
      panoChangeListener.remove();
      povChangeListener.remove();
    };
  }, [map, isPickingLocation, onStreetViewChange]);

  useEffect(() => {
    if (!firestore || spotsLoading || isSeeding || spots === null || !user) return;

    if (spots && spots.length === 0) {
      const seedDb = async () => {
        if(!firestore || !user) return;
        setIsSeeding(true);
        try {
          await seedDatabaseWithSpots(firestore, user.uid);
          toast({
            title: "Map views added!",
            description: "Some interesting views have been added to your map to get you started.",
          });
        } catch (error) {
          console.error("Error seeding database: ", error);
          toast({
            variant: "destructive",
            title: "Database Seeding Error",
            description: "Could not add default views to the map.",
          });
        } finally {
          setIsSeeding(false);
        }
      };

      seedDb();
    }
  }, [firestore, spots, spotsLoading, isSeeding, toast, user]);

  const filteredSpots = useMemo(() => {
    if (!spots) return [];

    let spotsToFilter = spots;

    if (spotTypeFilter === 'my-spots' && user) {
      spotsToFilter = spotsToFilter.filter((spot) => spot.authorId === user.uid);
    } else if (spotTypeFilter === 'my-favorites' && userProfile && userProfile.favoriteSpotIds) {
      spotsToFilter = spotsToFilter.filter((spot) => userProfile.favoriteSpotIds?.includes(spot.id));
    } else if (spotTypeFilter === 'highest-rated') {
        spotsToFilter = [...spotsToFilter] 
          .map(spot => ({
              ...spot,
              averageRating: (spot.ratingCount ?? 0) > 0 ? (spot.totalRating ?? 0) / spot.ratingCount! : 0
          }))
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 20);
    }
    
    if (categoryFilter !== 'all') {
      spotsToFilter = spotsToFilter.filter((spot) => spot.category === categoryFilter);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      spotsToFilter = spotsToFilter.filter(spot => {
        const titleMatch = spot.title.toLowerCase().includes(lowercasedQuery);
        const descriptionMatch = spot.description.toLowerCase().includes(lowercasedQuery);
        const cityMatch = spot.jurisdiction?.city?.toLowerCase().includes(lowercasedQuery);
        const stateMatch = spot.jurisdiction?.state?.toLowerCase().includes(lowercasedQuery);
        const countryMatch = spot.jurisdiction?.country?.toLowerCase().includes(lowercasedQuery);
        return titleMatch || descriptionMatch || cityMatch || stateMatch || countryMatch;
      });
    }

    return spotsToFilter;

  }, [categoryFilter, spotTypeFilter, spots, user, userProfile, searchQuery]);

  useEffect(() => {
    if (onFilteredSpotsChange) {
      onFilteredSpotsChange(filteredSpots);
    }
  }, [filteredSpots, onFilteredSpotsChange]);
  
  useEffect(() => {
    if (zoomToResults && filteredSpots.length > 0 && map && mapsLib?.LatLngBounds && mapsLib?.LatLng) {
      if (filteredSpots.length === 1) {
        handleExploreSpot(filteredSpots[0]);
      } else {
        const bounds = new mapsLib.LatLngBounds();
        filteredSpots.forEach(spot => {
          bounds.extend(new mapsLib.LatLng(spot.location.lat, spot.location.lng));
        });
        map.fitBounds(bounds);
      }
    }
  }, [zoomToResults, filteredSpots, map, mapsLib, handleExploreSpot]);

  useEffect(() => {
    if (selectedSpot && spots) {
      const updatedSpot = spots.find(s => s.id === selectedSpot.id);
      if (updatedSpot) {
        if (JSON.stringify(selectedSpot) !== JSON.stringify(updatedSpot)) {
          setSelectedSpot(updatedSpot);
        }
      }
    }
  }, [spots, selectedSpot]);
  

  const handleMarkerClick = (spot: Spot) => {
    if (isPickingLocation || !map) return;
    
    setSelectedSpot(spot);
    setDetailSheetVisible(true);
    
    const panorama = map.getStreetView();
    if (panorama && panorama.getVisible()) {
        panorama.setPosition(spot.location);
    }
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    setDetailSheetVisible(isOpen);
    const panorama = map?.getStreetView();
    if (!isOpen && (!panorama || !panorama.getVisible())) {
        setSelectedSpot(null);
    }
  };

  const handleBackToMap = () => {
    const panorama = map?.getStreetView();
    if (panorama?.getVisible()) {
        panorama.setVisible(false);
    }
    setSelectedSpot(null);
  };

  const handleSeeOnMap = (spot: Spot) => {
    if (!map) return;
    handleBackToMap();
    map.moveCamera({ center: spot.location, zoom: 17 });
  };

  const handleConfirmLocation = async () => {
    if (!firestore || !spotIdToUpdate || !currentPano) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update location. Missing data.',
      });
      return;
    }

    try {
      await updateSpotLocation(firestore, spotIdToUpdate, currentPano);
      
      toast({
        title: 'Location Updated!',
        description: 'The view\'s location has been successfully changed.',
      });
      
      const panorama = map?.getStreetView();
      if (panorama?.getVisible()) {
        panorama.setVisible(false);
      }
      
      setTimeout(() => {
        const updatedSpot = spots?.find(s => s.id === spotIdToUpdate);
        if (updatedSpot) {
          setSelectedSpot({ ...updatedSpot, location: currentPano });
        }
        setSpotIdToUpdate(null);
        setDetailSheetVisible(true);
      }, 500);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not save the new location.',
      });
    }
  };
  
  const handleEditLocationStart = (spot: Spot) => {
    if (!map) return;
    setSpotIdToUpdate(spot.id);
    setSelectedSpot(spot);
    setDetailSheetVisible(false);
    map.setCenter(spot.location);
    map.setZoom(18);
    toast({
      title: 'Editing Location',
      description: 'Drag the pegman to a new Street View and click "Confirm New Location".',
    });
  };


  const handleCancelEditLocation = () => {
    setSpotIdToUpdate(null); 
    
    setTimeout(() => {
      const panorama = map?.getStreetView();
      if (panorama?.getVisible()) {
        panorama.setVisible(false);
      }
      if (spotIdToUpdate && spots) {
        const originalSpot = spots.find(s => s.id === spotIdToUpdate);
        if (originalSpot) {
          setSelectedSpot(originalSpot);
        }
      }
      setDetailSheetVisible(true);
    }, 100);
  };

  const handleSpotSubmit = async (
    newSpotData: Omit<Spot, 'id' | 'authorId' | 'createdAt'>
  ) => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit a view.',
      });
      return;
    }

    try {
      await submitNewSpot(firestore, user.uid, newSpotData);
      toast({
        title: 'View Submitted!',
        description: 'Your new view has been added to the map.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description:
          error.message || 'There was a problem submitting your view.',
      });
    }
  };
  
  const author = useMemo(() => {
    if (!selectedSpot) return null;
    const mockAuthor = mockUsers.find(
      (user) => user.id === selectedSpot.authorId
    );
    if (mockAuthor) return mockAuthor;
    
    if(user && user.uid === selectedSpot.authorId){
      return {
        id: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email || "",
        avatarUrl: user.photoURL || ""
      }
    }

    return null;
  }, [selectedSpot, user]);
  
  const getPinStyle = (spot: Spot) => {
    let borderColor = 'hsl(var(--secondary-foreground))';

    const isMySpot = user && spot.authorId === user.uid;
    const isFavorite = userProfile && userProfile.favoriteSpotIds?.includes(spot.id);

    if (spotTypeFilter === 'my-spots' && isMySpot) {
      borderColor = 'hsl(var(--primary))';
    } else if (spotTypeFilter === 'my-favorites' && isFavorite) {
      borderColor = 'hsl(var(--accent))';
    } else if (spotTypeFilter === 'highest-rated') {
      borderColor = 'hsl(var(--chart-1))';
    }
  
    return {
      fontSize: '2rem',
      textShadow: `0 0 4px hsl(var(--background)), 0 0 6px hsl(var(--background)), 0 0 8px ${borderColor}, 0 0 10px ${borderColor}`,
    };
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (!map || !place) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else if (place.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  };
  
  const handleShowDetails = () => {
    setDetailSheetVisible(true);
  };

  const handleMapChange = () => {
    if (map && onMapExtentChange) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom) {
        onMapExtentChange({
          center: { lat: center.lat(), lng: center.lng() },
          zoom: zoom
        });
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={targetExtent?.center || { lat: 40.7128, lng: -74.006 }}
        defaultZoom={targetExtent?.zoom || 3}
        gestureHandling={'greedy'}
        streetViewControl={true}
        mapTypeControl={false}
        mapId="a3a79d3596a2414"
        mapTypeId={mapTypeId}
        onDragStart={onPan}
        onDragEnd={handleMapChange}
        onZoomChanged={handleMapChange}
      >
        {!isStreetViewActive && <MapSearchBox onPlaceSelect={handlePlaceSelect} />}
        {onMapTypeIdChange && mapTypeId && !isStreetViewActive && (
          <MapTypeControl mapTypeId={mapTypeId} onMapTypeIdChange={onMapTypeIdChange} />
        )}
        {(spotsLoading || isSeeding) && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex h-[40px] items-center gap-1 bg-background/80 p-1 rounded-lg shadow-lg border backdrop-blur-sm animate-pulse w-[156px]">
            <div className="flex-1 bg-muted/80 h-full rounded-md" />
            <div className="flex-1 bg-muted/80 h-full rounded-md" />
            <div className="flex-1 bg-muted/80 h-full rounded-md" />
            <div className="flex-1 bg-muted/80 h-full rounded-md" />
           </div>
        )}
        <TooltipProvider>
          {filteredSpots.map((spot) => {
            const emoji = categoryEmojis[spot.category] || '📍';
            const pinStyle = getPinStyle(spot);
            
            return (
              <Tooltip key={spot.id}>
                <TooltipTrigger asChild>
                    <AdvancedMarker
                        position={spot.location}
                        onClick={() => handleMarkerClick(spot)}
                    >
                        <button className="group transform transition-transform duration-200 ease-in-out hover:scale-125 focus:outline-none">
                            <span style={pinStyle} role="img" aria-label={`${spot.category} view`}>{emoji}</span>
                        </button>
                    </AdvancedMarker>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{spot.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </Map>
      
      {isStreetViewActive && selectedSpot && !isDetailSheetVisible && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            onClick={handleShowDetails}
            className="h-auto flex-col p-3"
          >
            <Info className="h-6 w-6" />
            <span className="mt-1 text-xs leading-none">Show</span>
            <span className="text-xs leading-none">Details</span>
          </Button>
        </div>
      )}

      {isStreetViewActive && !selectedSpot && currentPano && !isPickingLocation && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <SubmitSpotDialog
            location={currentPano}
            open={isSubmitDialogOpen}
            onOpenChange={setSubmitDialogOpen}
            onSpotSubmit={handleSpotSubmit}
          >
            <Button size="lg" disabled={!user}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Submit This View
            </Button>
          </SubmitSpotDialog>
        </div>
      )}

      {isPickingLocation && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
          <Button variant="destructive" size="lg" onClick={handleCancelEditLocation}>
            <XCircle className="mr-2 h-5 w-5" />
            Cancel
          </Button>
          <Button size="lg" onClick={handleConfirmLocation} disabled={!currentPano}>
            <CheckCircle className="mr-2 h-5 w-5" />
            Confirm New Location
          </Button>
        </div>
      )}
      
       {!user && isStreetViewActive && !selectedSpot && !isPickingLocation && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-center">
             <p className="text-sm bg-background/80 text-foreground p-2 rounded-md shadow-lg">Log in to submit views!</p>
          </div>
        )}
      
      <SpotDetailSheet
        spot={selectedSpot}
        author={author}
        open={!!selectedSpot && isDetailSheetVisible}
        onOpenChange={handleSheetOpenChange}
        onBackToMap={handleBackToMap}
        onExploreSpot={handleExploreSpot}
        onEditLocation={handleEditLocationStart}
        onSeeOnMap={handleSeeOnMap}
      />
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;

    