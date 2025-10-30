
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
import { Scale } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';

interface LegalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegalDialog({ open, onOpenChange }: LegalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Scale className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-headline">Legal Notice</DialogTitle>
          <DialogDescription className="text-center pt-2 text-foreground/80">
            Google Street View is a registered trademark of Google Inc. This website, "Best of Street View", is not related to Alphabet or Google companies.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button className="w-full">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
