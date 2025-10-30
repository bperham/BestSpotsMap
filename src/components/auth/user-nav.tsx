'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/firebase';
import { LogOut, User as UserIcon, Loader2, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { signOut } from '@/firebase/auth/auth-service';
import { useState } from 'react';
import { LegalDialog } from '../legal/legal-dialog';

export function UserNav() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLegalDialogOpen, setLegalDialogOpen] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
      toast({
        title: "You've been logged out.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Error',
        description: error.message,
      });
    }
  };

  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  }

  if (!user) {
    if (pathname === '/login') {
      return (
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      );
    }
    if (pathname === '/signup') {
      return (
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0) : <UserIcon />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.displayName || 'Anonymous User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <a href="/profile" className="flex items-center w-full cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLegalDialogOpen(true)}>
              <Scale className="mr-2 h-4 w-4" />
              <span>Legal</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <LegalDialog open={isLegalDialogOpen} onOpenChange={setLegalDialogOpen} />
    </>
  );
}