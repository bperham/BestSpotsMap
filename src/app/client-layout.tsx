
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCollection, useFirestore } from '@/firebase';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import type { Spot, Category, SpotType } from '@/lib/types';
import HomePage from './home';
import { collection, query, where } from 'firebase/firestore';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProfilePage = pathname === '/profile';
  const isHomePage = pathname === '/';

  const [randomSpot, setRandomSpot] = useState<Spot | null>(null);
  
  const firestore = useFirestore();
  const spotsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'spots'), where('isApproved', '==', true));
  }, [firestore]);
  const { data: spots, loading: spotsLoading } = useCollection<Spot>(spotsQuery);

  // State moved from home.tsx
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [spotTypeFilter, setSpotTypeFilter] = useState<SpotType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [isSearchResultsOpen, setSearchResultsOpen] = useState(false);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [zoomToResults, setZoomToResults] = useState(false);

  // Handlers moved from home.tsx
  const onCategoryFilterChange = (value: Category | 'all') => {
    setCategoryFilter(value);
  };

  const onSpotTypeFilterChange = (value: SpotType) => {
    setSpotTypeFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === '') {
      setSubmittedSearchQuery('');
      setSearchResultsOpen(false);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedSearchQuery(searchQuery);
    setSearchResultsOpen(searchQuery.length > 0);
    if(searchQuery.length > 0 && filteredSpots.length > 0){
        setZoomToResults(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedSearchQuery('');
    setSearchResultsOpen(false);
  }

  const handleGoToRandomSpot = useCallback(() => {
    if (spots && spots.length > 0) {
      const randomIndex = Math.floor(Math.random() * spots.length);
      const spot = spots[randomIndex];
      setRandomSpot(spot);
      if (spot) {
        setTimeout(() => setRandomSpot(null), 100);
      }
    }
  }, [spots]);

  return (
    <div className="relative flex w-full flex-col h-screen">
      <Header 
        showFilters={isHomePage}
        onGoToRandomSpot={handleGoToRandomSpot}
        spotsAvailable={!!spots && spots.length > 0}
        onCategoryFilterChange={onCategoryFilterChange}
        onSpotTypeFilterChange={onSpotTypeFilterChange}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        searchQuery={searchQuery}
      />
      {isHomePage ? (
         <HomePage 
            goToRandomSpot={randomSpot} 
            spots={spots} 
            spotsLoading={spotsLoading}
            categoryFilter={categoryFilter}
            spotTypeFilter={spotTypeFilter}
            submittedSearchQuery={submittedSearchQuery}
            isSearchResultsOpen={isSearchResultsOpen}
            setSearchResultsOpen={setSearchResultsOpen}
            filteredSpots={filteredSpots}
            onFilteredSpotsChange={setFilteredSpots}
            zoomToResults={zoomToResults}
            setZoomToResults={setZoomToResults}
            onClearSearch={handleClearSearch}
        />
      ) : (
          <div
            className={cn(
              'flex-1 flex flex-col',
              isAuthPage ? 'items-center justify-center' : '',
              isProfilePage ? 'overflow-y-auto' : ''
            )}
          >
            {children}
          </div>
      )}
    </div>
  );
}
