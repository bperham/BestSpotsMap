
'use client';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface MapNavigationProps {
  onBack: () => void;
  onForward: () => void;
  onHome: () => void;
  onGlobe: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function MapNavigation({ onBack, onForward, onHome, onGlobe, canGoBack, canGoForward }: MapNavigationProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <TooltipProvider>
        <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg shadow-lg border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 text-xl" size="icon" onClick={onBack} disabled={!canGoBack}>
                <span>⬅️</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous Location</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 text-xl" size="icon" onClick={onGlobe}>
                <span>🌍</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Full Earth</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 text-xl" size="icon" onClick={onHome}>
                <span>🏠</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 text-xl" size="icon" onClick={onForward} disabled={!canGoForward}>
                <span>➡️</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Next Location</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
