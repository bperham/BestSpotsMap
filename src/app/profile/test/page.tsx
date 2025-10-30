
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TestProfilePage() {
  return (
    <div className="container max-w-5xl py-8 text-center">
      <h1 className="text-4xl font-bold font-headline mb-4">Test Profile Page</h1>
      <p className="text-muted-foreground mb-6">
        If you can see this, the navigation is working correctly.
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Map
        </Link>
      </Button>
    </div>
  );
}
