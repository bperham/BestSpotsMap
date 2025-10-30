
'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Spot } from '@/lib/types';
import { MapPin, Search } from 'lucide-react';

interface SearchResultsSidebarProps {
  isOpen: boolean;
  spots: Spot[];
  onSpotSelect: (spot: Spot) => void;
  onClose: () => void;
}

function SearchResultCard({ spot, onSelect }: { spot: Spot; onSelect: (spot: Spot) => void }) {
    const streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${spot.location.lat},${spot.location.lng}&fov=${spot.location.fov}&heading=${spot.location.heading}&pitch=${spot.location.pitch}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    
    const formatJurisdiction = () => {
        if (!spot?.jurisdiction) return null;
        const { city, state, country } = spot.jurisdiction;
        return [city, state, country].filter(Boolean).join(', ');
    }

  return (
    <div className="flex gap-4 p-3 border-b">
      <img
        src={streetViewImageUrl}
        alt={`Street View of ${spot.title}`}
        className="w-28 h-20 object-cover rounded-md bg-muted"
        data-ai-hint="street view"
         onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/150x100/212939/94a3b8?text=No+Image';
              target.alt = 'Street view not available';
         }}
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
            <h3 className="font-semibold line-clamp-1">{spot.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{spot.description}</p>
            {formatJurisdiction() && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3"/> {formatJurisdiction()}
                </p>
            )}
        </div>
        <Button size="sm" variant="outline" className="w-fit" onClick={() => onSelect(spot)}>
          Go to View
        </Button>
      </div>
    </div>
  );
}

export function SearchResultsSidebar({ isOpen, spots, onSpotSelect, onClose }: SearchResultsSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="left" 
        className="sm:max-w-sm w-full p-0 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Search className="w-5 h-5"/>
            Search Results ({spots.length})
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          {spots.length > 0 ? (
            <div>
              {spots.map((spot) => (
                <SearchResultCard key={spot.id} spot={spot} onSelect={onSpotSelect} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <h3 className="font-semibold">No views found</h3>
              <p className="text-sm text-muted-foreground">
                Try a different search term or adjust your filters.
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

    

    
