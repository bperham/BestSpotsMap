'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Card } from '../ui/card';

interface MapSearchResultsProps {
    predictions: google.maps.places.AutocompletePrediction[];
    onSelect: (prediction: google.maps.places.AutocompletePrediction) => void;
    onClose: () => void;
}

export function MapSearchResults({ predictions, onSelect, onClose }: MapSearchResultsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <Card ref={containerRef} className="absolute bottom-full mb-2 w-full bg-background shadow-lg max-h-60 overflow-y-auto">
            <ul>
                {predictions.map((prediction) => (
                    <li 
                        key={prediction.place_id}
                        onClick={() => onSelect(prediction)}
                        className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    >
                        <p className="font-semibold text-sm">{prediction.structured_formatting.main_text}</p>
                        <p className="text-xs text-muted-foreground">{prediction.structured_formatting.secondary_text}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
