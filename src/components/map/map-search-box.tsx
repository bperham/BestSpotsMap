
'use client';

import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '../ui/input';
import { MapSearchResults } from './map-search-results';
import { useDebounce } from 'use-debounce';

interface MapSearchBoxProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export function MapSearchBox({ onPlaceSelect }: MapSearchBoxProps) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 500);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  useEffect(() => {
    if (!debouncedInputValue || !autocompleteService || !map) {
      setPredictions([]);
      setShowResults(false);
      return;
    }

    const request = {
      input: debouncedInputValue,
      bounds: map.getBounds(),
    };

    autocompleteService.getPlacePredictions(request, (newPredictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && newPredictions) {
        setPredictions(newPredictions);
        setShowResults(true);
      } else {
        setPredictions([]);
        setShowResults(false);
      }
    });
  }, [debouncedInputValue, autocompleteService, map]);

  const handleSelectPrediction = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['geometry', 'name', 'formatted_address'],
    };

    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        onPlaceSelect(place);
        setInputValue(''); // Clear input text
        setShowResults(false);
        setPredictions([]);
      }
    });
  }, [placesService, onPlaceSelect]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!e.target.value) {
      setShowResults(false);
    }
  }

  return (
    <div className="absolute bottom-4 left-4 z-50 w-full max-w-xs">
        <Input 
            ref={inputRef} 
            type="text" 
            placeholder="Search Google Maps..."
            className="shadow-lg"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => predictions.length > 0 && setShowResults(true)}
        />
        {showResults && (
            <MapSearchResults 
                predictions={predictions} 
                onSelect={handleSelectPrediction}
                onClose={() => setShowResults(false)}
            />
        )}
    </div>
  );
}
