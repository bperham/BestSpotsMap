
'use client';

import Link from 'next/link';
import { Dices, Search } from 'lucide-react';
import { Logo } from '@/components/icons';
import { UserNav } from '@/components/auth/user-nav';
import { CategoryFilter } from '../spots/category-filter';
import type { Category, Spot, SpotType } from '@/lib/types';
import { SpotTypeFilter } from '../spots/spot-type-filter';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';

interface HeaderProps {
  onCategoryFilterChange?: (value: Category | 'all') => void;
  onSpotTypeFilterChange?: (value: SpotType) => void;
  onGoToRandomSpot?: () => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  searchQuery?: string;
  showFilters?: boolean;
  spotsAvailable?: boolean;
}

export function Header({
  onCategoryFilterChange,
  onSpotTypeFilterChange,
  onGoToRandomSpot,
  onSearchChange,
  onSearchSubmit,
  searchQuery,
  showFilters = false,
  spotsAvailable = false,
}: HeaderProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-screen-2xl items-center px-2 py-2">
        <div className="mr-4 flex items-center">
          <button onClick={handleHomeClick} className="flex items-center space-x-2 focus:outline-none">
            <Logo className="h-10 w-10 [filter:drop-shadow(0_2px_4px_rgba(0,0,0,1))]" />
            <span className="hidden font-headline font-bold sm:inline-block text-2xl text-yellow-400 [text-shadow:0_2px_4px_rgba(0,0,0,1)]">
              The Best Spots
            </span>
          </button>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          {showFilters && (
            <div className="flex items-center gap-2">
              {onCategoryFilterChange && <CategoryFilter onFilterChange={onCategoryFilterChange} />}
              {onSpotTypeFilterChange && <SpotTypeFilter onFilterChange={onSpotTypeFilterChange} />}
            </div>
          )}
          {showFilters && onGoToRandomSpot && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onGoToRandomSpot}
                    disabled={!spotsAvailable}
                    className="whitespace-normal h-auto font-normal"
                  >
                    <span role="img" aria-label="dice" className="mr-2">🎲</span>
                    Surprise Me!
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to a random spot!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {showFilters && onSearchChange && onSearchSubmit && (
            <form onSubmit={onSearchSubmit} className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a spot..."
                className="pl-9"
                value={searchQuery}
                onChange={onSearchChange}
              />
            </form>
          )}
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center justify-end">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
