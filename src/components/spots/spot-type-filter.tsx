'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/firebase';
import type { SpotType } from '@/lib/types';
import React from 'react';

interface SpotTypeFilterProps {
  onFilterChange: (value: SpotType) => void;
}

const spotTypes: { value: SpotType; label: string, emoji?: string }[] = [
  { value: 'all', label: 'All Spots', emoji: '🌍' },
  { value: 'my-spots', label: 'My Spots', emoji: '👤' },
  { value: 'my-favorites', label: 'My Favorites', emoji: '⭐' },
  { value: 'highest-rated', label: 'Highest Rated', emoji: '🏆' },
];

export function SpotTypeFilter({ onFilterChange }: SpotTypeFilterProps) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Select defaultValue="all" onValueChange={onFilterChange}>
      <SelectTrigger className="w-auto border bg-background">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        {spotTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
             <div className="flex items-center gap-2">
              {type.emoji && <span className="text-lg" role="img">{type.emoji}</span>}
              <span>{type.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

    