// toutes les tables de ma base de données

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'organizer';
    password: string;
    created_at: Date;
    updated_at: Date;
}

export type Event = {
    id: string;
    name: string;
    description: string;
    place: string;
    nbreplace: number;
    image_url: string;
    organizerId: string; // Foreign key referencing User.id
    created_at: Date;
    updated_at: Date;
}
