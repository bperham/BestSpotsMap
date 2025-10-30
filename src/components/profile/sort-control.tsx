
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortAsc, SortDesc } from 'lucide-react';

export type SortMethod = 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc';

interface SortControlProps {
  onSortChange: (value: SortMethod) => void;
  sortMethod: SortMethod;
}

export function SortControl({ onSortChange, sortMethod }: SortControlProps) {
  return (
    <div className="flex items-center justify-end">
      <Select value={sortMethod} onValueChange={onSortChange}>
        <SelectTrigger className="w-auto border bg-background h-9">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">
            <div className="flex items-center gap-2">
              <SortDesc className="h-4 w-4" />
              <span>Date Added (Newest)</span>
            </div>
          </SelectItem>
          <SelectItem value="date-asc">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <span>Date Added (Oldest)</span>
            </div>
          </SelectItem>
          <SelectItem value="alpha-asc">
             <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <span>Alphabetical (A-Z)</span>
            </div>
          </SelectItem>
           <SelectItem value="alpha-desc">
             <div className="flex items-center gap-2">
              <SortDesc className="h-4 w-4" />
              <span>Alphabetical (Z-A)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
