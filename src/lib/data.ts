
      
import type { User, Spot } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rover',
    email: 'alex.rover@example.com',
    avatarUrl: PlaceHolderImages[0].imageUrl,
  },
  {
    id: 'user-2',
    name: 'Terra Explorer',
    email: 'terra.explorer@example.com',
    avatarUrl: PlaceHolderImages[1].imageUrl,
  },
  {
    id: 'user-3',
    name: 'Globe Trotter',
    email: 'globe.trotter@example.com',
    avatarUrl: PlaceHolderImages[2].imageUrl,
  }
];

export const spots: Omit<Spot, 'ratingCount' | 'totalRating' | 'ratings'>[] = [
  {
    id: 'spot-1',
    title: 'The Sunken City of Olous',
    description: 'Just off the coast of Elounda, you can see the ruins of an ancient city submerged in the sea. A truly mesmerizing sight from the shore.',
    category: 'interesting',
    location: { lat: 35.2642, lng: 25.7233, heading: 90, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Elounda', country: 'Greece' },
    authorId: 'user-1', // Placeholder, will be replaced by user's UID
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: 'spot-2',
    title: 'A Car... on a Balcony?',
    description: 'How did it get there? Why is it there? So many questions for this bizarre automotive placement in a quiet neighborhood.',
    category: 'funny',
    location: { lat: 48.8584, lng: 2.2945, heading: 200, pitch: 10, fov: 90 },
    jurisdiction: { city: 'Paris', country: 'France' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-15T14:30:00Z',
  },
  {
    id: 'spot-3',
    title: 'The Wave Organ',
    description: 'A unique acoustic sculpture that plays music with the tides of the San Francisco Bay. A strange and beautiful auditory experience.',
    category: 'strange',
    location: { lat: 37.8087, lng: -122.4407, heading: 270, pitch: 5, fov: 90 },
    jurisdiction: { city: 'San Francisco', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-05T09:15:00Z',
  },
  {
    id: 'spot-4',
    title: 'Breathtaking Fjord View',
    description: 'An absolutely stunning viewpoint overlooking one of Norway\'s most picturesque fjords. The sheer scale and beauty are hard to capture.',
    category: 'beautiful',
    location: { lat: 62.1023, lng: 7.0921, heading: 180, pitch: -5, fov: 90 },
    jurisdiction: { country: 'Norway' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-20T18:00:00Z',
  },
  {
    id: 'spot-5',
    title: 'The Shibuya Crossing',
    description: 'The world\'s busiest intersection is a sight to behold. A perfect representation of the organized chaos of Tokyo.',
    category: 'cool',
    location: { lat: 35.6591, lng: 139.7006, heading: 45, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Shibuya', country: 'Japan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-12T12:00:00Z',
  },
  {
    id: 'spot-6',
    title: 'Hobbiton Movie Set',
    description: 'Step into the world of Middle-earth. The charming Hobbit holes and the Green Dragon Inn are a must-see for any fan.',
    category: 'cool',
    location: { lat: -37.8573, lng: 175.6796, heading: 120, pitch: 5, fov: 100 },
    jurisdiction: { city: 'Matamata', country: 'New Zealand' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'spot-7',
    title: 'The Great Pyramid of Giza',
    description: 'The last remaining wonder of the ancient world. Its sheer size and age are humbling.',
    category: 'interesting',
    location: { lat: 29.9792, lng: 31.1342, heading: 45, pitch: 0, fov: 80 },
    jurisdiction: { city: 'Giza', country: 'Egypt' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-10T08:20:00Z',
  },
  {
    id: 'spot-8',
    title: 'The Door to Hell',
    description: 'A giant natural gas crater in Turkmenistan that has been burning continuously for over 50 years. A truly hellish landscape.',
    category: 'creepy',
    location: { lat: 40.2522, lng: 58.4394, heading: 0, pitch: 10, fov: 100 },
    jurisdiction: { city: 'Darvaza', country: 'Turkmenistan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-01T22:00:00Z',
  },
  {
    id: 'spot-9',
    title: 'Salar de Uyuni',
    description: 'The world\'s largest salt flat creates a mesmerizing mirror effect during the rainy season. It feels like walking on the sky.',
    category: 'beautiful',
    location: { lat: -20.2288, lng: -67.4891, heading: 180, pitch: 0, fov: 110 },
    jurisdiction: { country: 'Bolivia' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-01T13:00:00Z',
  },
  {
    id: 'spot-10',
    title: 'Giant Gummy Bears',
    description: 'A roadside attraction featuring a collection of unusually large, colorful gummy bear statues. A sweet and surreal spot.',
    category: 'funny',
    location: { lat: 34.0522, lng: -118.2437, heading: 270, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-12-01T17:45:00Z',
  },
  {
    id: 'spot-11',
    title: 'The Island of the Dolls',
    description: 'A creepy island in Mexico filled with hundreds of decaying dolls hanging from trees, said to be haunted by the spirit of a young girl.',
    category: 'creepy',
    location: { lat: 19.2907, lng: -99.0982, heading: 30, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Xochimilco', country: 'Mexico' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-31T23:59:00Z',
  },
  {
    id: 'spot-12',
    title: 'Fly Geyser',
    description: 'A bizarre, multicolored geyser in the Nevada desert that was accidentally created by well drilling. It looks like it belongs on another planet.',
    category: 'strange',
    location: { lat: 40.8587, lng: -119.3331, heading: 240, pitch: 15, fov: 100 },
    jurisdiction: { state: 'NV', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-10T16:20:00Z',
  },
  {
    id: 'spot-13',
    title: 'Underwater Sculpture Park',
    description: 'A collection of hauntingly beautiful sculptures submerged in the clear waters off the coast of Grenada.',
    category: 'art',
    location: { lat: 12.0835, lng: -61.7661, heading: 150, pitch: 20, fov: 90 },
    jurisdiction: { country: 'Grenada' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-01T11:30:00Z',
  },
  {
    id: 'spot-14',
    title: 'Cat Island',
    description: 'Tashirojima in Japan is an island where cats outnumber humans, roaming freely and bringing good luck.',
    category: 'people',
    location: { lat: 38.3186, lng: 141.4172, heading: 90, pitch: 0, fov: 100 },
    jurisdiction: { country: 'Japan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-22T13:10:00Z',
  },
  {
    id: 'spot-15',
    title: 'The Gates of Perception',
    description: 'A mind-bending optical illusion mural painted on a building in Paris that makes it look like it is melting.',
    category: 'art',
    location: { lat: 48.8732, lng: 2.3522, heading: 180, pitch: 5, fov: 80 },
    jurisdiction: { city: 'Paris', country: 'France' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-14T15:00:00Z',
  },
  {
    id: 'spot-16',
    title: 'Abandoned Soviet Space Shuttles',
    description: 'Two abandoned Buran-class space shuttles sit decaying in a massive hangar at the Baikonur Cosmodrome.',
    category: 'abandoned',
    location: { lat: 45.9205, lng: 63.3444, heading: 270, pitch: 10, fov: 110 },
    jurisdiction: { country: 'Kazakhstan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-18T05:00:00Z',
  },
  {
    id: 'spot-17',
    title: 'The City of the Dead',
    description: 'A vast necropolis in Cairo where people live and work amongst the ancient tombs and mausoleums.',
    category: 'creepy',
    location: { lat: 30.0381, lng: 31.2725, heading: 200, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Cairo', country: 'Egypt' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-20T10:40:00Z',
  },
  {
    id: 'spot-18',
    title: 'Glass Beach',
    description: 'A beach in California famous for its abundance of smooth, colorful sea glass, created from years of dumping garbage into an area of coastline.',
    category: 'beautiful',
    location: { lat: 39.4543, lng: -123.8139, heading: 300, pitch: 5, fov: 100 },
    jurisdiction: { city: 'Fort Bragg', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-22T19:00:00Z',
  },
  {
    id: 'spot-19',
    title: 'The Gnome Reserve',
    description: 'A whimsical woodland in the UK home to over 1,000 garden gnomes and pixies. Visitors are encouraged to wear provided gnome hats.',
    category: 'funny',
    location: { lat: 50.8172, lng: -4.0531, heading: 135, pitch: 10, fov: 90 },
    jurisdiction: { country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-15T14:00:00Z',
  },
  {
    id: 'spot-20',
    title: 'Sagrada Família',
    description: 'Gaudí\'s unfinished masterpiece in Barcelona. A stunning example of unique architectural vision that has been under construction for over a century.',
    category: 'architecture',
    location: { lat: 41.4036, lng: 2.1744, heading: 225, pitch: 15, fov: 80 },
    jurisdiction: { city: 'Barcelona', country: 'Spain' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-25T17:00:00Z',
  },
  {
    id: 'spot-21',
    title: 'The Hand in the Desert',
    description: 'A giant sculpture of a hand rising from the sand in the middle of Chile\'s Atacama Desert.',
    category: 'strange',
    location: { lat: -24.1539, lng: -70.1533, heading: 0, pitch: 0, fov: 90 },
    jurisdiction: { country: 'Chile' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-19T12:00:00Z',
  },
  {
    id: 'spot-22',
    title: 'Christ of the Abyss',
    description: 'A submerged bronze statue of Jesus Christ in the Mediterranean Sea, placed to protect fishermen and scuba divers.',
    category: 'creepy',
    location: { lat: 44.3161, lng: 9.1764, heading: 180, pitch: 30, fov: 80 },
    jurisdiction: { city: 'San Fruttuoso', country: 'Italy' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-25T10:10:00Z',
  },
  {
    id: 'spot-23',
    title: 'Avenue of the Baobabs',
    description: 'A striking group of baobab trees lining a dirt road in western Madagascar. An iconic and otherworldly landscape.',
    category: 'nature',
    location: { lat: -20.2508, lng: 44.4183, heading: 90, pitch: 0, fov: 100 },
    jurisdiction: { country: 'Madagascar' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-18T07:00:00Z',
  },
  {
    id: 'spot-24',
    title: 'The Winchester Mystery House',
    description: 'A bizarre mansion in California with doors that lead to nowhere, stairs that go up to the ceiling, and countless other architectural oddities.',
    category: 'architecture',
    location: { lat: 37.3184, lng: -121.9489, heading: 315, pitch: 5, fov: 90 },
    jurisdiction: { city: 'San Jose', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-13T20:00:00Z',
  },
  {
    id: 'spot-25',
    title: 'The Cube Houses',
    description: 'A set of innovative houses tilted at 45 degrees in Rotterdam, designed to resemble trees in a forest.',
    category: 'buildings',
    location: { lat: 51.9201, lng: 4.4901, heading: 60, pitch: 10, fov: 85 },
    jurisdiction: { city: 'Rotterdam', country: 'Netherlands' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-20T14:50:00Z',
  },
  {
    id: 'spot-26',
    title: 'The Waitomo Glowworm Caves',
    description: 'A cave system in New Zealand known for its population of glowworms that create a starry night effect on the ceilings.',
    category: 'beautiful',
    location: { lat: -38.2612, lng: 175.1051, heading: 0, pitch: 20, fov: 100 },
    jurisdiction: { country: 'New Zealand' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-08T21:00:00Z',
  },
  {
    id: 'spot-27',
    title: 'The Catacombs of Paris',
    description: 'Underground ossuaries in Paris which hold the remains of more than six million people in a small part of a tunnel network.',
    category: 'creepy',
    location: { lat: 48.8338, lng: 2.3323, heading: 180, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Paris', country: 'France' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-05T13:30:00Z',
  },
  {
    id: 'spot-28',
    title: 'The Garden of Cosmic Speculation',
    description: 'A private garden in Scotland inspired by modern physics, with sculptures and landscaping representing concepts like black holes and fractals.',
    category: 'art',
    location: { lat: 55.0805, lng: -3.7601, heading: 45, pitch: 0, fov: 90 },
    jurisdiction: { country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-01T12:00:00Z',
  },
  {
    id: 'spot-29',
    title: 'Spotted Lake',
    description: 'A saline endorheic alkali lake in British Columbia, Canada, which is covered in large spots of mineral deposits in the summer.',
    category: 'nature',
    location: { lat: 49.0781, lng: -119.5654, heading: 270, pitch: 10, fov: 100 },
    jurisdiction: { state: 'BC', country: 'Canada' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-25T18:00:00Z',
  },
  {
    id: 'spot-30',
    title: 'Carhenge',
    description: 'A replica of England\'s Stonehenge located in Nebraska, made entirely from vintage American automobiles.',
    category: 'funny',
    location: { lat: 42.1439, lng: -102.8583, heading: 10, pitch: 0, fov: 90 },
    jurisdiction: { state: 'NE', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-30T16:00:00Z',
  },
  {
    id: 'spot-31',
    title: 'The Great Blue Hole',
    description: 'A giant marine sinkhole off the coast of Belize, over 300 meters across and 125 meters deep. A scuba diver\'s paradise.',
    category: 'beautiful',
    location: { lat: 17.3161, lng: -87.5352, heading: 0, pitch: -20, fov: 100 },
    jurisdiction: { country: 'Belize' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-15T13:45:00Z',
  },
  {
    id: 'spot-32',
    title: 'The Sedlec Ossuary',
    description: 'A small Roman Catholic chapel in the Czech Republic, decorated with the skeletons of between 40,000 and 70,000 people.',
    category: 'creepy',
    location: { lat: 49.9616, lng: 15.2881, heading: 200, pitch: 5, fov: 80 },
    jurisdiction: { city: 'Kutná Hora', country: 'Czech Republic' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-29T11:20:00Z',
  },
  {
    id: 'spot-33',
    title: 'Zhangye National Geopark',
    description: 'Known as the "Rainbow Mountains", these colorful rock formations in China are a result of mineral deposits over 24 million years.',
    category: 'nature',
    location: { lat: 38.9111, lng: 100.1333, heading: 120, pitch: -10, fov: 110 },
    jurisdiction: { country: 'China' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-10T09:00:00Z',
  },
  {
    id: 'spot-34',
    title: 'The Hanging Temple of Hengshan',
    description: 'A temple built into a cliff near Mount Heng in China. It appears to be hanging in mid-air, supported by thin wooden stilts.',
    category: 'architecture',
    location: { lat: 39.6644, lng: 113.7258, heading: 300, pitch: 25, fov: 70 },
    jurisdiction: { country: 'China' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-18T14:00:00Z',
  },
  {
    id: 'spot-35',
    title: 'Prada Marfa',
    description: 'A permanently installed sculpture by artists Elmgreen and Dragset, situated in the middle of the Texas desert, designed to resemble a Prada store.',
    category: 'art',
    location: { lat: 30.5058, lng: -104.2889, heading: 45, pitch: 0, fov: 90 },
    jurisdiction: { state: 'TX', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-05-20T19:30:00Z',
  },
  {
    id: 'spot-36',
    title: 'The "Glitch" Building',
    description: 'A mapping error resulted in this building appearing warped and distorted on Street View, creating an unintentional piece of digital art.',
    category: 'glitch',
    location: { lat: 40.7580, lng: -73.9855, heading: 180, pitch: 20, fov: 80 },
    jurisdiction: { city: 'New York', state: 'NY', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-06-01T01:01:01Z',
  },
  {
    id: 'spot-37',
    title: 'The Chapel of the Holy Cross',
    description: 'A Roman Catholic chapel built directly into the red rock buttes of Sedona, Arizona. A stunning fusion of faith and nature.',
    category: 'buildings',
    location: { lat: 34.8322, lng: -111.7668, heading: 210, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Sedona', state: 'AZ', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-12-12T16:00:00Z',
  },
  {
    id: 'spot-38',
    title: 'The Last Blockbuster',
    description: 'The world\'s last remaining Blockbuster video store, located in Bend, Oregon. A nostalgic trip back to the 90s.',
    category: 'interesting',
    location: { lat: 44.0582, lng: -121.3142, heading: 90, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Bend', state: 'OR', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-03T18:00:00Z',
  },
  {
    id: 'spot-39',
    title: 'Pigeon People of Venice',
    description: 'A group of people wearing incredibly realistic pigeon masks, often seen congregating in St. Mark\'s Square. Bizarre and slightly unsettling.',
    category: 'people',
    location: { lat: 45.4342, lng: 12.3382, heading: 15, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Venice', country: 'Italy' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-04-01T12:00:00Z',
  },
  {
    id: 'spot-40',
    title: 'Maunsell Sea Forts',
    description: 'Eerie, rusting anti-aircraft towers from WWII standing on stilts in the Thames Estuary. They look like something from a sci-fi film.',
    category: 'abandoned',
    location: { lat: 51.4925, lng: 1.1517, heading: 270, pitch: 10, fov: 100 },
    jurisdiction: { country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-10T06:30:00Z',
  },
  {
    id: 'spot-41',
    title: 'The Forest of Knives',
    description: 'A section of the Tsingy de Bemaraha National Park in Madagascar, featuring a dense "forest" of razor-sharp limestone pinnacles.',
    category: 'nature',
    location: { lat: -18.6667, lng: 44.7167, heading: 45, pitch: -5, fov: 110 },
    jurisdiction: { country: 'Madagascar' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-28T09:30:00Z',
  },
  {
    id: 'spot-42',
    title: 'The Museum of Bad Art',
    description: 'A museum in Massachusetts dedicated to the collection, preservation, and celebration of bad art in all its forms. "Art too bad to be ignored."',
    category: 'funny',
    location: { lat: 42.2706, lng: -71.2131, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Dedham', state: 'MA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-12-25T15:15:15Z',
  },
  {
    id: 'spot-43',
    title: 'The Cold War "Woodpecker"',
    description: 'The massive, abandoned Duga radar array near Chernobyl, which emitted a sharp, repetitive tapping noise that earned it the nickname "Russian Woodpecker".',
    category: 'abandoned',
    location: { lat: 51.3069, lng: 30.0639, heading: 90, pitch: 15, fov: 100 },
    jurisdiction: { country: 'Ukraine' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-04-26T10:00:00Z',
  },
  {
    id: 'spot-44',
    title: 'The Unfinished Nuclear Power Plant',
    description: 'The cooling tower of an abandoned nuclear power plant in Washington state, with "graffiti" that is actually a stunningly detailed mural.',
    category: 'art',
    location: { lat: 46.5686, lng: -120.3550, heading: 240, pitch: 10, fov: 90 },
    jurisdiction: { state: 'WA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-15T17:20:00Z',
  },
  {
    id: 'spot-45',
    title: 'The Hill of Crosses',
    description: 'A site of pilgrimage in northern Lithuania with hundreds of thousands of crosses, crucifixes, and religious statues left by visitors.',
    category: 'interesting',
    location: { lat: 56.0153, lng: 23.4167, heading: 0, pitch: 5, fov: 90 },
    jurisdiction: { country: 'Lithuania' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-01T11:11:11Z',
  },
  {
    id: 'spot-46',
    title: 'The Giant of the Apennines',
    description: 'A colossal 16th-century stone statue of a mountain god, half man, half mountain, at the Villa di Pratolino in Tuscany, Italy.',
    category: 'art',
    location: { lat: 43.8642, lng: 11.2961, heading: 135, pitch: 10, fov: 80 },
    jurisdiction: { city: 'Vaglia', country: 'Italy' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-29T14:00:00Z',
  },
  {
    id: 'spot-47',
    title: 'Fremont Troll',
    description: 'A massive sculpture under a bridge in Seattle, clutching a real Volkswagen Beetle. A classic piece of Fremont\'s quirky public art.',
    category: 'strange',
    location: { lat: 47.6510, lng: -122.3473, heading: 270, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Seattle', state: 'WA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-07T19:07:07Z',
  },
  {
    id: 'spot-48',
    title: 'Kummakivi Balancing Rock',
    description: 'A huge rock in Finland that has been balancing on top of another convex rock for thousands of years, seemingly defying gravity.',
    category: 'nature',
    location: { lat: 61.4936, lng: 28.5986, heading: 90, pitch: 0, fov: 90 },
    jurisdiction: { country: 'Finland' },
    authorId: 'user-1', // Placeholder
    createdAt: '203-08-08T08:08:08Z',
  },
  {
    id: 'spot-49',
    title: 'The Kelpies',
    description: 'Two gigantic, 30-meter-high horse-head sculptures in Falkirk, Scotland, representing mythical water spirits.',
    category: 'cool',
    location: { lat: 56.0150, lng: -3.7550, heading: 180, pitch: 10, fov: 80 },
    jurisdiction: { city: 'Falkirk', country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-15T17:30:00Z',
  },
  {
    id: 'spot-50',
    title: 'The "Up" House',
    description: 'A real-life, colorful house in Utah that is a replica of the house from the Disney-Pixar movie "Up".',
    category: 'buildings',
    location: { lat: 40.5364, lng: -111.9016, heading: 0, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Herriman', state: 'UT', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-12-10T14:20:00Z',
  },
  {
    id: 'spot-51',
    title: 'The Blue City of Chefchaouen',
    description: 'A stunning Moroccan city where nearly all the buildings in the old town are painted a brilliant sky blue.',
    category: 'beautiful',
    location: { lat: 35.1713, lng: -5.2683, heading: 220, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Chefchaouen', country: 'Morocco' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-10T11:50:00Z',
  },
  {
    id: 'spot-52',
    title: 'Oradour-sur-Glane',
    description: 'A French village left exactly as it was after a Nazi massacre in 1944. A haunting and powerful memorial.',
    category: 'abandoned',
    location: { lat: 45.9322, lng: 1.0317, heading: 10, pitch: 0, fov: 90 },
    jurisdiction: { country: 'France' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-10T10:30:00Z',
  },
  {
    id: 'spot-53',
    title: 'The World\'s Largest Rubber Duck',
    description: 'A giant, inflatable rubber duck created by artist Florentijn Hofman that travels to cities worldwide. Its location is temporary, but its memory is forever.',
    category: 'funny',
    location: { lat: 34.0407, lng: -118.2598, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-15T15:00:00Z',
  },
  {
    id: 'spot-54',
    title: 'Svalbard Global Seed Vault',
    description: 'A secure seed bank on the Norwegian island of Spitsbergen, designed to preserve a wide variety of plant seeds in the event of a global catastrophe.',
    category: 'interesting',
    location: { lat: 78.2356, lng: 15.4913, heading: 310, pitch: 5, fov: 90 },
    jurisdiction: { country: 'Norway' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'spot-55',
    title: 'Hashima Island (Battleship Island)',
    description: 'An abandoned island off the coast of Nagasaki, Japan, once a bustling coal mining facility. Now a spooky ghost town and a UNESCO World Heritage site.',
    category: 'abandoned',
    location: { lat: 32.6278, lng: 129.7383, heading: 90, pitch: 10, fov: 100 },
    jurisdiction: { country: 'Japan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-05-10T09:00:00Z',
  },
  {
    id: 'spot-56',
    title: 'The Wave',
    description: 'A stunning sandstone rock formation in Arizona, known for its colorful, undulating forms. Access is tightly regulated via a lottery system.',
    category: 'nature',
    location: { lat: 36.9959, lng: -112.0063, heading: 20, pitch: -5, fov: 100 },
    jurisdiction: { state: 'AZ', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-25T14:00:00Z',
  },
  {
    id: 'spot-57',
    title: 'The Vessel',
    description: 'An extraordinary spiral staircase and public art piece in Hudson Yards, New York City, with 154 interconnected flights of stairs.',
    category: 'architecture',
    location: { lat: 40.7537, lng: -74.0022, heading: 270, pitch: 20, fov: 75 },
    jurisdiction: { city: 'New York', state: 'NY', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-18T18:30:00Z',
  },
  {
    id: 'spot-58',
    title: 'The Mütter Museum',
    description: 'A medical museum in Philadelphia containing a collection of medical oddities, anatomical and pathological specimens, wax models, and antique medical equipment.',
    category: 'creepy',
    location: { lat: 39.9542, lng: -75.1741, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Philadelphia', state: 'PA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-30T13:00:00Z',
  },
  {
    id: 'spot-59',
    title: 'The Longaberger Basket Building',
    description: 'A former corporate headquarters in Ohio, famous for being a 7-story replica of a giant picnic basket. Now sadly vacant.',
    category: 'buildings',
    location: { lat: 40.0381, lng: -82.3831, heading: 120, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Newark', state: 'OH', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-20T11:00:00Z',
  },
  {
    id: 'spot-60',
    title: 'The Crooked Forest',
    description: 'A grove of oddly-shaped pine trees in Poland. All the trees are bent at a 90-degree angle at their base, and the reason remains a mystery.',
    category: 'strange',
    location: { lat: 53.2144, lng: 14.4756, heading: 45, pitch: 0, fov: 100 },
    jurisdiction: { country: 'Poland' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-01T10:00:00Z',
  },
  {
    id: 'spot-61',
    title: 'Salvation Mountain',
    description: 'A massive, colorful folk art installation in the California desert, covered in Christian sayings and bible verses.',
    category: 'art',
    location: { lat: 33.2541, lng: -115.4725, heading: 220, pitch: 10, fov: 90 },
    jurisdiction: { city: 'Niland', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-05-05T17:00:00Z',
  },
  {
    id: 'spot-62',
    title: 'The Waitomo Hotel Glitch',
    description: 'A Street View glitch that makes the historic Waitomo Caves Hotel appear as a bizarre, melting, psychedelic structure.',
    category: 'glitch',
    location: { lat: -38.2514, lng: 175.1118, heading: 190, pitch: 5, fov: 90 },
    jurisdiction: { country: 'New Zealand' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-06-02T10:10:10Z',
  },
  {
    id: 'spot-63',
    title: 'The People of La Tomatina',
    description: 'The world\'s largest food fight, where thousands of people gather in Buñol, Spain, to throw tomatoes at each other. A messy, chaotic, and fun spectacle.',
    category: 'people',
    location: { lat: 39.4194, lng: -0.7911, heading: 90, pitch: 0, fov: 100 },
    jurisdiction: { city: 'Buñol', country: 'Spain' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-30T11:00:00Z',
  },
  {
    id: 'spot-64',
    title: 'The Icelandic Phallological Museum',
    description: 'The world\'s only museum dedicated to penises and penile parts, with a collection of over 200 specimens from various mammals.',
    category: 'interesting',
    location: { lat: 64.1466, lng: -21.9166, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Reykjavik', country: 'Iceland' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-30T13:00:00Z',
  },
  {
    id: 'spot-65',
    title: 'The Sky-High Tennis Court',
    description: 'A tennis court located on the helipad of the Burj Al Arab hotel in Dubai, over 200 meters in the air. A terrifying place to play.',
    category: 'cool',
    location: { lat: 25.1412, lng: 55.1852, heading: 0, pitch: 30, fov: 80 },
    jurisdiction: { city: 'Dubai', country: 'UAE' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-22T12:00:00Z',
  },
  {
    id: 'spot-66',
    title: 'The Temple of the Rats',
    description: 'The Karni Mata Temple in India is home to thousands of holy rats, which are fed and revered by worshippers.',
    category: 'creepy',
    location: { lat: 27.7915, lng: 73.3411, heading: 150, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Deshnoke', country: 'India' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-11T11:11:11Z',
  },
  {
    id: 'spot-67',
    title: 'The Tianzi Mountains',
    description: 'Jaw-dropping quartz-sandstone pillars in China that were an inspiration for the floating mountains in the movie Avatar.',
    category: 'nature',
    location: { lat: 29.3167, lng: 110.4667, heading: 270, pitch: -15, fov: 100 },
    jurisdiction: { country: 'China' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-20T08:00:00Z',
  },
  {
    id: 'spot-68',
    title: 'The "Real" Mos Eisley',
    description: 'The filming locations for the desert planet of Tatooine from Star Wars are still standing in the deserts of Tunisia.',
    category: 'interesting',
    location: { lat: 33.9945, lng: 7.8436, heading: 240, pitch: 5, fov: 95 },
    jurisdiction: { country: 'Tunisia' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-05-04T10:00:00Z',
  },
  {
    id: 'spot-69',
    title: 'The Bubblegum Alley',
    description: 'An alley in San Luis Obispo, California, where the walls have been covered in used chewing gum for decades.',
    category: 'strange',
    location: { lat: 35.2800, lng: -120.6640, heading: 180, pitch: 0, fov: 80 },
    jurisdiction: { city: 'San Luis Obispo', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-09T09:09:09Z',
  },
  {
    id: 'spot-70',
    title: 'Centralia, Pennsylvania',
    description: 'A near-ghost town that has been on fire from an underground coal mine since 1962. Smoke still billows from cracks in the ground.',
    category: 'abandoned',
    location: { lat: 40.7998, lng: -76.3411, heading: 330, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Centralia', state: 'PA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-10T10:10:10Z',
  },
  {
    id: 'spot-71',
    title: 'Machu Picchu',
    description: 'An Incan citadel set high in the Andes Mountains in Peru, renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
    category: 'beautiful',
    location: { lat: -13.1631, lng: -72.5450, heading: 310, pitch: -10, fov: 100 },
    jurisdiction: { country: 'Peru' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-15T08:00:00Z',
  },
  {
    id: 'spot-72',
    title: 'The Chapel of the Bones',
    description: 'An unsettling 16th-century chapel in Portugal, where the interior walls are covered and decorated with human skulls and bones.',
    category: 'creepy',
    location: { lat: 38.5702, lng: -7.9090, heading: 180, pitch: 5, fov: 80 },
    jurisdiction: { city: 'Évora', country: 'Portugal' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-02T14:00:00Z',
  },
  {
    id: 'spot-73',
    title: 'The Giant\'s Causeway',
    description: 'An area of about 40,000 interlocking basalt columns, the result of an ancient volcanic eruption, in Northern Ireland.',
    category: 'nature',
    location: { lat: 55.2408, lng: -6.5116, heading: 30, pitch: 0, fov: 100 },
    jurisdiction: { country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-02T16:00:00Z',
  },
  {
    id: 'spot-74',
    title: 'Eiffel Tower View from Trocadéro',
    description: 'The classic, postcard-perfect view of the Eiffel Tower from the Jardins du Trocadéro.',
    category: 'beautiful',
    location: { lat: 48.8615, lng: 2.2893, heading: 115, pitch: 0, fov: 80 },
    jurisdiction: { city: 'Paris', country: 'France' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-21T18:00:00Z',
  },
  {
    id: 'spot-75',
    title: 'The Lost City of Petra',
    description: 'A breathtaking archaeological city in Jordan, famous for its rock-cut architecture and water conduit system.',
    category: 'architecture',
    location: { lat: 30.3285, lng: 35.4444, heading: 350, pitch: 0, fov: 90 },
    jurisdiction: { country: 'Jordan' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-12-05T09:30:00Z',
  },
  {
    id: 'spot-76',
    title: 'The Market Theatre Gum Wall',
    description: 'A brick wall covered in used chewing gum located in an alleyway in downtown Seattle. A very sticky situation.',
    category: 'strange',
    location: { lat: 47.6094, lng: -122.3402, heading: 200, pitch: 0, fov: 85 },
    jurisdiction: { city: 'Seattle', state: 'WA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-12T16:20:00Z',
  },
  {
    id: 'spot-77',
    title: 'The World\'s Largest Chest of Drawers',
    description: 'A building in High Point, North Carolina, shaped like a giant 38-foot-tall chest of drawers.',
    category: 'buildings',
    location: { lat: 35.9610, lng: -79.9961, heading: 150, pitch: 5, fov: 90 },
    jurisdiction: { city: 'High Point', state: 'NC', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-11T11:11:11Z',
  },
  {
    id: 'spot-78',
    title: 'The Golden Bridge',
    description: 'A stunning pedestrian bridge in Vietnam held up by two giant stone hands.',
    category: 'art',
    location: { lat: 15.9962, lng: 107.9942, heading: 90, pitch: -5, fov: 100 },
    jurisdiction: { city: 'Da Nang', country: 'Vietnam' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-03-28T10:00:00Z',
  },
  {
    id: 'spot-79',
    title: 'The Inhabited "Rock"',
    description: 'A massive boulder in Portugal with a house built right into it, complete with a door, windows, and a chimney.',
    category: 'buildings',
    location: { lat: 41.4883, lng: -7.9806, heading: 30, pitch: 5, fov: 90 },
    jurisdiction: { country: 'Portugal' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-05T15:00:00Z',
  },
  {
    id: 'spot-80',
    title: 'The "Hole lotta donuts" Sign',
    description: 'A classic donut shop sign in La Puente, California, featuring a drive-thru that goes through the center of a giant donut.',
    category: 'funny',
    location: { lat: 34.0205, lng: -117.9547, heading: 0, pitch: 0, fov: 90 },
    jurisdiction: { city: 'La Puente', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-01T07:00:00Z',
  },
  {
    id: 'spot-81',
    title: 'The "Follow Me" Couple',
    description: 'A couple was captured on Street View in multiple locations across the globe, always in the same "follow me" pose. An internet mystery.',
    category: 'people',
    location: { lat: 36.1699, lng: -115.1398, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Las Vegas', state: 'NV', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-02-14T12:00:00Z',
  },
  {
    id: 'spot-82',
    title: 'The Great Wall of China',
    description: 'Walking along a section of this ancient wonder of the world is an unforgettable experience. The scale is almost unimaginable.',
    category: 'interesting',
    location: { lat: 40.4319, lng: 116.5704, heading: 0, pitch: -5, fov: 100 },
    jurisdiction: { country: 'China' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-04-30T09:00:00Z',
  },
  {
    id: 'spot-83',
    title: 'The Pink Lake',
    description: 'Lake Hillier in Australia is a vibrant pink color, believed to be caused by algae. The contrast with the blue ocean is stunning.',
    category: 'nature',
    location: { lat: -34.0950, lng: 122.1550, heading: 90, pitch: -10, fov: 110 },
    jurisdiction: { country: 'Australia' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-11-30T13:00:00Z',
  },
  {
    id: 'spot-84',
    title: 'The "LEGO" Bridge',
    description: 'A bridge in Wuppertal, Germany, painted to look like it\'s made of giant LEGO bricks. A colorful and creative piece of public art.',
    category: 'art',
    location: { lat: 51.2721, lng: 7.1866, heading: 250, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Wuppertal', country: 'Germany' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-22T15:30:00Z',
  },
  {
    id: 'spot-85',
    title: 'The Teapot Gas Station',
    description: 'A former gas station in Zillah, Washington, built in the 1920s in the shape of a giant teapot as a political statement.',
    category: 'buildings',
    location: { lat: 46.4046, lng: -120.2642, heading: 110, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Zillah', state: 'WA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-04T12:00:00Z',
  },
  {
    id: 'spot-86',
    title: 'The "Scuba Diver Chasing a Fish" Mural',
    description: 'A humorous and well-executed mural on the side of a building that interacts with the real-world environment.',
    category: 'funny',
    location: { lat: 51.5074, lng: -0.1278, heading: 180, pitch: 10, fov: 80 },
    jurisdiction: { city: 'London', country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-05-20T14:45:00Z',
  },
  {
    id: 'spot-87',
    title: 'The "Headless Man" Glitch',
    description: 'A classic Street View glitch where a person\'s body is visible but their head has been perfectly erased by the privacy-blurring algorithm.',
    category: 'glitch',
    location: { lat: 37.7749, lng: -122.4194, heading: 90, pitch: 0, fov: 90 },
    jurisdiction: { city: 'San Francisco', state: 'CA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-06-03T11:11:11Z',
  },
  {
    id: 'spot-88',
    title: 'The "Largest Ball of Twine"',
    description: 'One of several massive balls of twine in the US that claims to be the largest. This one, in Cawker City, Kansas, is still growing.',
    category: 'strange',
    location: { lat: 39.5090, lng: -98.4345, heading: 0, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Cawker City', state: 'KS', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-04-15T13:00:00Z',
  },
  {
    id: 'spot-89',
    title: 'The "Fallen" Angel',
    description: 'A sculpture in a Madrid park depicting Lucifer falling from Heaven. A powerful and slightly controversial piece of public art.',
    category: 'art',
    location: { lat: 40.4103, lng: -3.6826, heading: 180, pitch: 5, fov: 90 },
    jurisdiction: { city: 'Madrid', country: 'Spain' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-15T16:30:00Z',
  },
  {
    id: 'spot-90',
    title: 'The "Skinny House" of Boston',
    description: 'An extremely narrow, four-story house in Boston, rumored to have been built out of spite between two brothers.',
    category: 'architecture',
    location: { lat: 42.3662, lng: -71.0561, heading: 240, pitch: 10, fov: 80 },
    jurisdiction: { city: 'Boston', state: 'MA', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-09-20T12:00:00Z',
  },
  {
    id: 'spot-91',
    title: 'The "Fake" Town for Movie Sets',
    description: 'An entire, fully functional but uninhabited town in New Mexico, built specifically for filming movies and TV shows.',
    category: 'interesting',
    location: { lat: 35.0436, lng: -106.9458, heading: 90, pitch: 0, fov: 100 },
    jurisdiction: { state: 'NM', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-01T10:00:00Z',
  },
  {
    id: 'spot-92',
    title: 'The Underground "Salt Cathedral"',
    description: 'A Roman Catholic church built within the tunnels of a salt mine 200 meters underground in Zipaquirá, Colombia.',
    category: 'cool',
    location: { lat: 5.0203, lng: -74.0047, heading: 180, pitch: 5, fov: 90 },
    jurisdiction: { country: 'Colombia' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-30T14:00:00Z',
  },
  {
    id: 'spot-93',
    title: 'The "World\'s Loneliest House"',
    description: 'A single, isolated house on a small island in the Vestmannaeyjar archipelago off the coast of Iceland. Its purpose is a local legend.',
    category: 'abandoned',
    location: { lat: 63.4024, lng: -20.3013, heading: 45, pitch: 10, fov: 100 },
    jurisdiction: { country: 'Iceland' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-15T18:00:00Z',
  },
  {
    id: 'spot-94',
    title: 'The "Singing" Road',
    description: 'A stretch of road in New Mexico that plays "America the Beautiful" as you drive over it at 45 mph, due to precisely spaced rumble strips.',
    category: 'interesting',
    location: { lat: 35.1325, lng: -106.3150, heading: 90, pitch: 0, fov: 90 },
    jurisdiction: { state: 'NM', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-06-20T17:00:00Z',
  },
  {
    id: 'spot-95',
    title: 'The "Face of the Devil" Rock',
    description: 'A natural rock formation in Peru that, from a certain angle, eerily resembles a screaming face.',
    category: 'creepy',
    location: { lat: -13.5226, lng: -71.9673, heading: 210, pitch: 15, fov: 90 },
    jurisdiction: { city: 'Cusco', country: 'Peru' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-10-31T00:00:00Z',
  },
  {
    id: 'spot-96',
    title: 'The "Horse-Headed" People',
    description: 'A group of people in Aberdeen, Scotland, who regularly gather in public wearing horse head masks. An enduring local mystery.',
    category: 'people',
    location: { lat: 57.1496, lng: -2.0943, heading: 180, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Aberdeen', country: 'United Kingdom' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-04-01T14:00:00Z',
  },
  {
    id: 'spot-97',
    title: 'The "Floating" Tap',
    description: 'A fountain in Spain that creates the illusion of a faucet magically floating in the air with an endless supply of water.',
    category: 'funny',
    location: { lat: 36.5099, lng: -6.2754, heading: 270, pitch: 5, fov: 80 },
    jurisdiction: { city: 'Cádiz', country: 'Spain' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-08-05T16:00:00Z',
  },
  {
    id: 'spot-98',
    title: 'The "Stairway to Heaven"',
    description: 'The Haʻikū Stairs, a steep hiking trail on the island of Oʻahu, Hawaii. Though officially closed, its views are legendary.',
    category: 'beautiful',
    location: { lat: 21.4011, lng: -157.8281, heading: 60, pitch: 20, fov: 90 },
    jurisdiction: { state: 'HI', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 'spot-99',
    title: 'The "Dancing House"',
    description: 'A unique deconstructivist building in Prague, resembling a pair of dancers. A bold and whimsical piece of modern architecture.',
    category: 'architecture',
    location: { lat: 50.0755, lng: 14.4141, heading: 330, pitch: 5, fov: 85 },
    jurisdiction: { city: 'Prague', country: 'Czech Republic' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-02-15T17:30:00Z',
  },
  {
    id: 'spot-100',
    title: 'The "UFO" Welcome Center',
    description: 'A saucer-shaped welcome center in Bowman, South Carolina, that offers a quirky and out-of-this-world greeting to visitors.',
    category: 'buildings',
    location: { lat: 33.3499, lng: -80.6865, heading: 45, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Bowman', state: 'SC', country: 'USA' },
    authorId: 'user-1', // Placeholder
    createdAt: '2023-07-20T20:00:00Z',
  },
  {
    id: 'spot-101',
    title: 'The Colosseum',
    description: 'An iconic ancient amphitheater in the center of Rome, Italy, known for its gladiatorial contests and public spectacles.',
    category: 'architecture',
    location: { lat: 41.8902, lng: 12.4922, heading: 270, pitch: 0, fov: 90 },
    jurisdiction: { city: 'Rome', country: 'Italy' },
    authorId: 'user-1', // Placeholder
    createdAt: '2024-06-10T09:00:00Z',
  }
];

    

    



    




