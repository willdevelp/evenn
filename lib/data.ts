// app/events/data.js
export const eventsData = [
  {
    id: 1,
    slug: 'concert-afro-night',
    title: 'Concert Afro Night',
    category: 'Concert',
    city: 'Douala',
    location: 'Salle des fêtes de Douala, Bonanjo',
    date: '20 Août 2026',
    time: '20:00',
    organizer: 'Afro Events SARL',
    description: `Préparez-vous à une soirée inoubliable avec les plus grands artistes de la scène afro ! 
    Au programme : des rythmes endiablés, des invités surprises et une ambiance électrique. 
    Ne manquez pas cet événement qui promet de faire vibrer Douala. 
    Venez nombreux pour danser et célébrer la musique africaine dans toute sa diversité. 
    Une expérience immersive vous attend avec des décors spectaculaires et un son de qualité.`,
    imageCover: '/images/concert-afro-cover.jpg', // remplacez par une vraie URL
    price: '10 000 FCFA',
    attendees: 342,
    rating: 4.8,
    tickets: [
      { type: 'VIP', price: '50 000 FCFA', available: true, perks: 'Accès coupe-file, buffet VIP, place assise numérotée' },
      { type: 'Standard', price: '10 000 FCFA', available: true, perks: 'Entrée générale, place debout' },
      { type: 'Étudiant', price: '5 000 FCFA', available: false, perks: 'Sur présentation de la carte étudiant' },
    ],
  },
  {
    id: 2,
    slug: 'atelier-cuisine-africaine',
    title: 'Atelier Cuisine Africaine',
    category: 'Atelier',
    city: 'Yaoundé',
    location: 'Espace gourmet, Mvog-Mbi',
    date: '25 Août 2026',
    time: '14:00',
    organizer: 'Saveurs d\'Afrique',
    description: `Apprenez à préparer les plats traditionnels africains avec des chefs renommés. 
    Au menu : poulet DG, ndolé, beignets de haricot, et bien d'autres délices. 
    Un moment convivial et gourmand à partager en famille ou entre amis.`,
    imageCover: '/images/atelier-cuisine-cover.jpg',
    price: '5 000 FCFA',
    attendees: 87,
    rating: 4.9,
    tickets: [
      { type: 'Standard', price: '5 000 FCFA', available: true, perks: 'Accès à l\'atelier, dégustation, recettes' },
      { type: 'Premium', price: '8 000 FCFA', available: true, perks: 'Place assise, tablier offert, livre de recettes' },
    ],
  },
  {
    id: 3,
    slug: 'conf-tech-innovation',
    title: 'Conférence Tech & Innovation',
    category: 'Conférence',
    city: 'Douala',
    location: 'Palais des Congrès, Akwa',
    date: '5 Septembre 2026',
    time: '09:00',
    organizer: 'Tech Hub Cameroun',
    description: `Une journée dédiée à l'innovation technologique en Afrique. 
    Des experts internationaux partageront leurs visions sur l'IA, la blockchain, la fintech et l'entrepreneuriat digital. 
    Networking, pitchs et ateliers pratiques vous attendent.`,
    imageCover: '/images/conf-tech-cover.jpg',
    price: '15 000 FCFA',
    attendees: 210,
    rating: 4.7,
    tickets: [
      { type: 'Early Bird', price: '10 000 FCFA', available: false, perks: 'Tarif réduit, places limitées' },
      { type: 'Standard', price: '15 000 FCFA', available: true, perks: 'Accès à toutes les sessions' },
      { type: 'VIP', price: '30 000 FCFA', available: true, perks: 'Déjeuner avec les speakers, goodies' },
    ],
  },
  {
    id: 4,
    slug: 'festival-jazz-fleuve',
    title: 'Festival Jazz au bord du fleuve',
    category: 'Festival',
    city: 'Garoua',
    location: 'Base de loisirs du fleuve Bénoué',
    date: '10 Septembre 2026',
    time: '18:00',
    organizer: 'Jazz & Culture',
    description: `Le plus grand festival de jazz du Nord-Cameroun. 
    3 jours de concerts, de jam sessions et de découvertes musicales dans un cadre idyllique au bord du fleuve. 
    Artistes locaux et internationaux réunis pour une expérience unique.`,
    imageCover: '/images/festival-jazz-cover.jpg',
    price: '12 000 FCFA',
    attendees: 560,
    rating: 4.9,
    tickets: [
      { type: 'Pass 1 jour', price: '12 000 FCFA', available: true, perks: 'Accès à une journée' },
      { type: 'Pass 3 jours', price: '25 000 FCFA', available: true, perks: 'Accès illimité, t-shirt offert' },
    ],
  },
  // ... ajoutez d'autres événements si besoin
];

export const getEventBySlug = (id: number) => {
  return eventsData.find((event) => event.id === id);
};