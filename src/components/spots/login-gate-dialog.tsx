'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface LoginGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginGateDialog({ open, onOpenChange }: LoginGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-headline">Unlock the Full Experience</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Create a free account or log in to explore this view in Street View, save your favorites, and submit your own amazing finds.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
          <Button asChild size="lg">
            <Link href="/signup">Create an Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Log In</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
