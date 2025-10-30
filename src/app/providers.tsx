'use client';

import type { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export function Providers({ children }: { children: ReactNode }) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="rounded-lg border bg-card p-6 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
          <p className="mt-2 text-muted-foreground">
            Google Maps API key is missing. Please add
            <code className="mx-2 rounded bg-muted px-1.5 py-1 font-mono text-sm">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>
            to your environment variables.
          </p>
        </div>
      </div>
    );
  }
  
  if (!firebaseApiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="rounded-lg border bg-card p-6 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
          <p className="mt-2 text-muted-foreground">
            Firebase API key is missing. Please add your Firebase configuration to a 
            <code className="mx-2 rounded bg-muted px-1.5 py-1 font-mono text-sm">
              .env.local
            </code>
            file in your project root.
          </p>
        </div>
      </div>
    );
  }

  return <APIProvider apiKey={googleMapsApiKey} libraries={['places']}>{children}</APIProvider>;
}
