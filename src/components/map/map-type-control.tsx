
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApiIsLoaded } from '@vis.gl/react-google-maps';

interface MapTypeControlProps {
  mapTypeId?: google.maps.MapTypeId;
  onMapTypeIdChange: (mapTypeId: google.maps.MapTypeId) => void;
}

export function MapTypeControl({ mapTypeId, onMapTypeIdChange }: MapTypeControlProps) {
  const isApiLoaded = useApiIsLoaded();

  if (!isApiLoaded || !mapTypeId) {
    return null;
  }

  const handleValueChange = (value: string) => {
    onMapTypeIdChange(value as google.maps.MapTypeId);
  };
  return (
    <div className="absolute top-4 left-4 z-10">
      <Select value={mapTypeId} onValueChange={handleValueChange}>
        <SelectTrigger className="w-auto border bg-background shadow-lg">
          <SelectValue placeholder="Map Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={google.maps.MapTypeId.ROADMAP}>Map</SelectItem>
          <SelectItem value={google.maps.MapTypeId.SATELLITE}>Satellite</SelectItem>
          <SelectItem value={google.maps.MapTypeId.HYBRID}>Hybrid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
