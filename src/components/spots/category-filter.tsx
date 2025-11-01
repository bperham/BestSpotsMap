
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  onFilterChange: (value: Category | 'all') => void;
}

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'abandoned', label: 'Abandoned' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'art', label: 'Art' },
  { value: 'beautiful', label: 'Beautiful' },
  { value: 'buildings', label: 'Buildings' },
  { value: 'cool', label: 'Cool' },
  { value: 'creepy', label: 'Creepy' },
  { value: 'funny', label: 'Funny' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'interesting', label: 'Interesting' },
  { value: 'nature', label: 'Nature' },
  { value: 'people', label: 'People' },
  { value: 'strange', label: 'Strange' },
];

const categoryEmojis: Record<Category | 'all', string> = {
  all: '🌍',
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

export function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  return (
    <Select defaultValue="all" onValueChange={onFilterChange}>
      <SelectTrigger className="h-auto w-auto border bg-background px-4 py-2">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.value} value={cat.value} className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-lg" role="img">
                {categoryEmojis[cat.value]}
              </span>
              <span className='w-full'>{cat.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
