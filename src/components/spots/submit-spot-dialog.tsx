
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Spot, Category, LocationAndPano } from '@/lib/types';
import { useMapsLibrary } from '@vis.gl/react-google-maps';


type SpotSubmission = Omit<Spot, 'id' | 'authorId' | 'createdAt' | 'ratingCount' | 'totalRating' | 'ratings'>;
type SpotUpdate = Partial<Omit<Spot, 'id' | 'authorId' | 'createdAt'>>;


interface SubmitSpotDialogProps {
  location?: LocationAndPano | null;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSpotSubmit: (spot: SpotSubmission | SpotUpdate) => void;
  isEditMode?: boolean;
  spotToEdit?: Spot | null;
}

export function SubmitSpotDialog({
  location: initialLocation,
  children,
  open,
  onOpenChange,
  onSpotSubmit,
  isEditMode = false,
  spotToEdit = null,
}: SubmitSpotDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationAndPano | null | undefined>(initialLocation);
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) {
      setGeocoder(new geocodingLib.Geocoder());
    }
  }, [geocodingLib]);


  const derivedOpen = open ?? isDialogOpen;
  const derivedOnOpenChange = onOpenChange ?? setDialogOpen;
  
  useEffect(() => {
    const geocodeLocation = async (location: LocationAndPano) => {
      if (!geocoder) return;

      try {
        const response = await geocoder.geocode({ location: { lat: location.lat, lng: location.lng }});
        if (response.results && response.results[0]) {
          const address = response.results[0].address_components;
          const getPart = (type: string) => address.find(c => c.types.includes(type))?.long_name || '';
          const getShortPart = (type: string) => address.find(c => c.types.includes(type))?.short_name || '';
          
          setCity(getPart('locality'));
          setState(getShortPart('administrative_area_level_1'));
          setCountry(getPart('country'));
        }
      } catch (error) {
        console.warn("Geocoding failed:", error);
      }
    };
    
    if (derivedOpen) {
      if (isEditMode && spotToEdit) {
        setTitle(spotToEdit.title);
        setDescription(spotToEdit.description);
        setCategory(spotToEdit.category);
        setCity(spotToEdit.jurisdiction?.city || '');
        setState(spotToEdit.jurisdiction?.state || '');
        setCountry(spotToEdit.jurisdiction?.country || '');
        setCurrentLocation(spotToEdit.location);
      } else {
          // Reset form for new submission
          setTitle('');
          setDescription('');
          setCategory('');
          setCity('');
          setState('');
          setCountry('');
          setCurrentLocation(initialLocation);
          if (initialLocation) {
            geocodeLocation(initialLocation);
          }
      }
    }
  }, [isEditMode, spotToEdit, initialLocation, derivedOpen, geocoder]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Please fill out title, description, and category before submitting.',
      });
      return;
    }
    
    const jurisdiction = {
        city: city || '',
        state: state || '',
        country: country || '',
    };

    const locationToSubmit = isEditMode ? undefined : currentLocation;


    if (isEditMode) {
        onSpotSubmit({ title, description, category, jurisdiction });
    } else if (locationToSubmit) {
        onSpotSubmit({ title, description, category, location: locationToSubmit, jurisdiction });
    } else {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "Location is missing.",
        });
        return;
    }

    derivedOnOpenChange(false);
  };

  return (
    <Dialog open={derivedOpen} onOpenChange={derivedOnOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {isEditMode ? 'Edit View' : 'Submit a New View'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the details for your view below." : "Found an interesting place? Fill out the details below. The location is automatically captured from your current Street View."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'The Sunken City'"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of the view."
                className="col-span-3"
                required
              />
            </div>
            
            {!isEditMode && (
                 <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">Location</Label>
                 <div className="col-span-3 flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                   <MapPin className="h-4 w-4 flex-shrink-0" />
                   <span className="flex-1">
                     {currentLocation 
                       ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                       : 'No location selected'
                     }
                   </span>
                 </div>
               </div>
            )}
           

            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select name="category" required value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="interesting">Interesting</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="strange">Strange</SelectItem>
                        <SelectItem value="cool">Cool</SelectItem>
                        <SelectItem value="creepy">Creepy</SelectItem>
                        <SelectItem value="beautiful">Beautiful</SelectItem>
                        <SelectItem value="people">People</SelectItem>
                        <SelectItem value="buildings">Buildings</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="glitch">Glitch</SelectItem>
                        <SelectItem value="architecture">Architecture</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., 'USA' (Auto-filled)"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State/Prov.
              </Label>
              <Input
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g., 'CA' (Auto-filled)"
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., 'San Francisco' (Auto-filled)"
                className="col-span-3"
              />
            </div>

          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!currentLocation && !isEditMode}
              style={{
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
              }}
            >
              {isEditMode ? 'Save Changes' : 'Submit View'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    
