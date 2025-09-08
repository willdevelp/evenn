// This file containt definition of my data

export type User = {
    id: string;
    name: string;
    email: string;
    image: string;
    password: string;
    events: string[];
}

export type Event = {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    image: string;
    prices: number[];
    place: number;
}

export type Price = {
    id: string;
    event: string;
    price: number;
}

export type Reserve = {
    id: string;
    event: string;
    nameReserve: string;
    typePrice: number;
    quantity: number;
    amount: number;
}