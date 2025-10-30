
import { Timestamp } from "firebase/firestore";

export type Category = 
  | 'interesting' 
  | 'funny' 
  | 'strange' 
  | 'cool'
  | 'creepy'
  | 'beautiful'
  | 'people'
  | 'buildings'
  | 'nature'
  | 'art'
  | 'glitch'
  | 'architecture'
  | 'abandoned';

export type SpotType = 'all' | 'my-spots' | 'my-favorites' | 'highest-rated';

export type MapExtent = {
    center: { lat: number; lng: number };
    zoom: number;
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  favoriteSpotIds?: string[];
  role?: 'admin' | 'user';
  homeLocation?: MapExtent;
}

export type LocationAndPano = {
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  fov: number;
};

export interface Spot {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: LocationAndPano;
  jurisdiction?: {
    city?: string;
    state?: string;
    country?: string;
  };
  authorId: string;
  createdAt: string | Timestamp;
  ratingCount?: number;
  totalRating?: number;
  ratings?: { [userId: string]: number };
  isApproved?: boolean;
}

export interface Feedback {
  id: string;
  user: {
    name: string;
    email: string;
  };
  subject: string;
  message: string;
  createdAt: Timestamp;
}
