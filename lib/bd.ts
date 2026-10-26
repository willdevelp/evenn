// lib/data.js
export const organizersData = [
  {
    id: 1,
    slug: 'afro-events',
    name: 'Afro Events SARL',
    logo: '/logos/afro-events.png', // placeholder
    description: `Afro Events est une agence spécialisée dans l'organisation de concerts, festivals et événements culturels en Afrique centrale. 
    Avec plus de 10 ans d'expérience, nous avons produit plus de 200 événements dans toute la région. 
    Notre mission est de promouvoir la richesse de la culture africaine à travers des expériences uniques et mémorables.`,
    social: {
      facebook: 'https://facebook.com/afroevents',
      instagram: 'https://instagram.com/afroevents',
      twitter: 'https://twitter.com/afroevents',
      website: 'https://afroevents.com',
    },
    events: [1, 2, 4], // IDs d'événements dans eventsData
  },
  {
    id: 2,
    slug: 'tech-hub-cameroun',
    name: 'Tech Hub Cameroun',
    logo: '/logos/tech-hub.png',
    description: `Tech Hub Cameroun est un espace d'innovation et de coworking dédié aux startups technologiques. 
    Nous organisons des conférences, des hackathons et des ateliers pour stimuler l'écosystème digital au Cameroun. 
    Rejoignez-nous pour façonner l'avenir de la tech en Afrique.`,
    social: {
      facebook: 'https://facebook.com/techhubcmr',
      twitter: 'https://twitter.com/techhubcmr',
      linkedin: 'https://linkedin.com/company/techhub-cameroun',
    },
    events: [3],
  },
];

export const eventsData = [
  {
    id: 1,
    slug: 'concert-afro-night',
    organizerId: 1,
    title: 'Concert Afro Night',
    category: 'Concert',
    city: 'Douala',
    location: 'Salle des fêtes, Bonanjo',
    date: '20 Août 2026',
    time: '20:00',
    organizer: 'Afro Events SARL',
    description: `Préparez-vous à une soirée inoubliable avec les plus grands artistes de la scène afro...`,
    price: '10 000 FCFA',
    attendees: 342,
    rating: 4.8,
    tickets: [
      { type: 'VIP', price: '50 000 FCFA', available: true, perks: 'Accès coupe-file, buffet VIP, place assise numérotée' },
      { type: 'Standard', price: '10 000 FCFA', available: true, perks: 'Entrée générale, place debout' },
      { type: 'Étudiant', price: '5 000 FCFA', available: false, perks: 'Sur présentation de la carte étudiant' },
    ],
    status: 'upcoming', // 'past' | 'upcoming' | 'ongoing'
  },
  {
    id: 2,
    slug: 'atelier-cuisine-africaine',
    organizerId: 1,
    title: 'Atelier Cuisine Africaine',
    category: 'Atelier',
    city: 'Yaoundé',
    location: 'Espace gourmet, Mvog-Mbi',
    date: '25 Août 2026',
    time: '14:00',
    organizer: 'Afro Events SARL',
    description: `Apprenez à préparer les plats traditionnels africains avec des chefs renommés...`,
    price: '5 000 FCFA',
    attendees: 87,
    rating: 4.9,
    tickets: [
      { type: 'Standard', price: '5 000 FCFA', available: true, perks: 'Accès à l\'atelier, dégustation, recettes' },
    ],
    status: 'upcoming',
  },
  {
    id: 3,
    slug: 'conf-tech-innovation',
    organizerId: 2,
    title: 'Conférence Tech & Innovation',
    category: 'Conférence',
    city: 'Douala',
    location: 'Palais des Congrès, Akwa',
    date: '5 Septembre 2026',
    time: '09:00',
    organizer: 'Tech Hub Cameroun',
    description: `Une journée dédiée à l'innovation technologique en Afrique...`,
    price: '15 000 FCFA',
    attendees: 210,
    rating: 4.7,
    tickets: [
      { type: 'Early Bird', price: '10 000 FCFA', available: false },
      { type: 'Standard', price: '15 000 FCFA', available: true },
    ],
    status: 'upcoming',
  },
  {
    id: 4,
    slug: 'festival-jazz-fleuve',
    organizerId: 1,
    title: 'Festival Jazz au bord du fleuve',
    category: 'Festival',
    city: 'Garoua',
    location: 'Base de loisirs du fleuve Bénoué',
    date: '10 Septembre 2026',
    time: '18:00',
    organizer: 'Afro Events SARL',
    description: `Le plus grand festival de jazz du Nord-Cameroun...`,
    price: '12 000 FCFA',
    attendees: 560,
    rating: 4.9,
    tickets: [
      { type: 'Pass 1 jour', price: '12 000 FCFA', available: true },
      { type: 'Pass 3 jours', price: '25 000 FCFA', available: true },
    ],
    status: 'upcoming',
  },
  {
    id: 5,
    slug: 'soiree-standup-comedy',
    organizerId: 1,
    title: 'Soirée Stand-up Comedy',
    category: 'Spectacle',
    city: 'Douala',
    location: 'Théâtre de Douala',
    date: '15 Juillet 2026',
    time: '21:00',
    organizer: 'Afro Events SARL',
    description: `Une soirée de rires avec les meilleurs humoristes de la scène comique...`,
    price: '8 000 FCFA',
    attendees: 180,
    rating: 4.6,
    tickets: [
      { type: 'Standard', price: '8 000 FCFA', available: true },
    ],
    status: 'past', // événement passé
  },
];

// Helper functions
export const getOrganizerBySlug = (slug: string) => {
  return organizersData.find(org => org.slug === slug);
};

export const getEventsByOrganizerId = (organizerId: number) => {
  return eventsData.filter(event => event.organizerId === organizerId);
};

export const getEventBySlug = (id: number) => {
  return eventsData.find(event => event.id === id);
};