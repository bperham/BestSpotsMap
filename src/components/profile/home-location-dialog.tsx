
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Map, AdvancedMarker, useMap, useApiIsLoaded } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback } from 'react';
import type { MapExtent } from '@/lib/types';
import { MapPin } from 'lucide-react';

const DEFAULT_LOCATION: MapExtent = { center: { lat: 40.7128, lng: -74.006 }, zoom: 3 };

interface HomeLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLocation?: MapExtent | null;
  onSave: (newLocation: MapExtent) => void;
}

function MapController({ center, zoom, onBoundsChanged }: { center: {lat: number, lng: number}, zoom: number, onBoundsChanged: (extent: MapExtent) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.moveCamera({ center, zoom });
    }
  }, [map, center, zoom]);

  const handleCameraChange = useCallback(() => {
    if (map) {
      const newCenter = map.getCenter();
      const newZoom = map.getZoom();
      if (newCenter && newZoom) {
        onBoundsChanged({
          center: { lat: newCenter.lat(), lng: newCenter.lng() },
          zoom: newZoom,
        });
      }
    }
  }, [map, onBoundsChanged]);
  
  useEffect(() => {
      if(!map) return;
      
      const idleListener = map.addListener('idle', handleCameraChange);
      
      return () => {
          idleListener.remove();
      }
      
  }, [map, handleCameraChange])

  return null;
}

export function HomeLocationDialog({ open, onOpenChange, currentLocation, onSave }: HomeLocationDialogProps) {
  const [mapExtent, setMapExtent] = useState<MapExtent>(currentLocation || DEFAULT_LOCATION);
  const isLoaded = useApiIsLoaded();

  useEffect(() => {
    if (open) {
      setMapExtent(currentLocation || DEFAULT_LOCATION);
    }
  }, [open, currentLocation]);

  const handleSave = () => {
    onSave(mapExtent);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Home Location</DialogTitle>
          <DialogDescription>
            Pan and zoom the map to set your preferred default starting location. The emoji marks the spot.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 relative">
          {isLoaded ? (
            <Map
              className="w-full h-full"
              defaultCenter={mapExtent.center}
              defaultZoom={mapExtent.zoom}
              gestureHandling={'greedy'}
              mapId="a3a79d3596a2414"
            >
              <MapController 
                center={mapExtent.center} 
                zoom={mapExtent.zoom} 
                onBoundsChanged={setMapExtent} 
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-4xl" role="img" aria-label="Home location marker">🏠</span>
              </div>
            </Map>
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                 <p>Loading Map...</p>
             </div>
          )}
          <div className="absolute bottom-4 left-4 bg-background/80 p-2 rounded-md text-xs shadow-md">
            {mapExtent?.center ? `Lat: ${mapExtent.center.lat.toFixed(4)}, Lng: ${mapExtent.center.lng.toFixed(4)}, Zoom: ${mapExtent.zoom}` : 'Loading...'}
          </div>
        </div>
        <DialogFooter className="p-6 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Home Location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
