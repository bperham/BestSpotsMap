
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import MapView from '@/components/map/map-view';
import type { Category, Spot, SpotType, MapExtent } from '@/lib/types';
import { SearchResultsSidebar } from '@/components/search/search-results-sidebar';
import { MapNavigation } from '@/components/map/map-navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApiIsLoaded } from '@vis.gl/react-google-maps';

const DEFAULT_HOME_EXTENT: MapExtent = { center: { lat: 40.7128, lng: -74.006 }, zoom: 3 };
const DEFAULT_GLOBE_EXTENT: MapExtent = { center: { lat: 0, lng: 0 }, zoom: 2 };


function BackToMapButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="h-10 px-4" onClick={onClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exit Street View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

interface HomePageProps {
    goToRandomSpot: Spot | null;
    spots: Spot[] | null;
    spotsLoading: boolean;
    categoryFilter: Category | 'all';
    spotTypeFilter: SpotType;
    submittedSearchQuery: string;
    isSearchResultsOpen: boolean;
    setSearchResultsOpen: (isOpen: boolean) => void;
    filteredSpots: Spot[];
    onFilteredSpotsChange: (spots: Spot[]) => void;
    zoomToResults: boolean;
    setZoomToResults: (zoom: boolean) => void;
    onClearSearch: () => void;
}

export default function HomePage({ 
    goToRandomSpot, 
    spots, 
    spotsLoading,
    categoryFilter,
    spotTypeFilter,
    submittedSearchQuery,
    isSearchResultsOpen,
    setSearchResultsOpen,
    filteredSpots,
    onFilteredSpotsChange,
    zoomToResults,
    setZoomToResults,
    onClearSearch,
}: HomePageProps) {
  const searchParams = useSearchParams();
  const [isStreetViewActive, setStreetViewActive] = useState(false);
  const mapViewRef = useRef<{ handleBackToMap: () => void; handleExploreSpot: (spot: Spot) => void }>(null);
  const router = useRouter();
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId | undefined>(undefined);
  const isApiLoaded = useApiIsLoaded();


  useEffect(() => {
    if (isApiLoaded && mapTypeId === undefined) {
      setMapTypeId(google.maps.MapTypeId.HYBRID);
    }
  }, [isApiLoaded, mapTypeId]);


  // Navigation state
  const { user } = useUser();
  const firestore = useFirestore();
  const userProfileRef = user ? doc(firestore!, 'users', user.uid) : null;
  const { data: userProfile } = useDoc(userProfileRef);
  
  const initialExtent = useMemo(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    if (lat && lng && zoom) {
      return {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: parseInt(zoom, 10)
      };
    }
    return userProfile?.homeLocation || DEFAULT_HOME_EXTENT;
  }, [searchParams, userProfile]);


  const [history, setHistory] = useState<MapExtent[]>([initialExtent]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExtent, setCurrentExtent] = useState<MapExtent>(initialExtent);
  const [navigationAction, setNavigationAction] = useState<'pan' | 'back' | 'forward' | 'home' | 'globe' | null>(null);
  
  const userHomeExtent = userProfile?.homeLocation;

  const handleSidebarSpotSelect = (spot: Spot) => {
    mapViewRef.current?.handleExploreSpot(spot);
    onClearSearch();
  }

  useEffect(() => {
    if (zoomToResults) {
      setZoomToResults(false);
    }
  }, [zoomToResults, setZoomToResults]);
  
  const handleMapExtentChange = useCallback((newExtent: MapExtent) => {
    const newHistory = history.slice(0, currentIndex + 1);
    
    // To avoid pushing identical extents consecutively
    if (JSON.stringify(newHistory[newHistory.length - 1]) !== JSON.stringify(newExtent)) {
      if (navigationAction === 'pan') {
          newHistory.push(newExtent);
          setHistory(newHistory);
          setCurrentIndex(newHistory.length - 1);
      }
    }
    
    const params = new URLSearchParams(window.location.search);
    params.set('lat', newExtent.center.lat.toString());
    params.set('lng', newExtent.center.lng.toString());
    params.set('zoom', newExtent.zoom.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
    
  }, [history, currentIndex, navigationAction]);
  
  const goBack = () => {
    if (currentIndex > 0) {
      setNavigationAction('back');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setNavigationAction('forward');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goHome = () => {
    const home = userHomeExtent || DEFAULT_HOME_EXTENT;
    setNavigationAction('home');
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(home);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };
  
  const goGlobe = () => {
    setNavigationAction('globe');
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(DEFAULT_GLOBE_EXTENT);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleBackToMapClick = () => {
    mapViewRef.current?.handleBackToMap();
  };

  useEffect(() => {
    if (history[currentIndex]) {
        setCurrentExtent(history[currentIndex]);
    }
  }, [currentIndex, history]);

  useEffect(() => {
    if (navigationAction) {
        const timeout = setTimeout(() => setNavigationAction(null), 500); 
        return () => clearTimeout(timeout);
    }
  }, [navigationAction]);


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 relative">
        {isStreetViewActive ? (
          <BackToMapButton onClick={handleBackToMapClick} />
        ) : (
          <MapNavigation
            onBack={goBack}
            onForward={goForward}
            onHome={goHome}
            onGlobe={goGlobe}
            canGoBack={currentIndex > 0}
            canGoForward={currentIndex < history.length - 1}
          />
        )}
        <SearchResultsSidebar 
          isOpen={isSearchResultsOpen && !isStreetViewActive}
          spots={filteredSpots}
          onSpotSelect={handleSidebarSpotSelect}
          onClose={onClearSearch}
        />
        <MapView 
          ref={mapViewRef}
          categoryFilter={categoryFilter} 
          spotTypeFilter={spotTypeFilter}
          goToRandomSpot={goToRandomSpot}
          searchQuery={submittedSearchQuery}
          onFilteredSpotsChange={onFilteredSpotsChange}
          zoomToResults={zoomToResults}
          onMapExtentChange={handleMapExtentChange}
          targetExtent={currentExtent}
          navigationAction={navigationAction}
          onStreetViewChange={setStreetViewActive}
          onPan={() => setNavigationAction('pan')}
          mapTypeId={mapTypeId}
          onMapTypeIdChange={setMapTypeId}
          spots={spots}
          spotsLoading={spotsLoading}
        />
      </main>
    </div>
  );
}
