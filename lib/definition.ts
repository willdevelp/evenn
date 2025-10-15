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
    title: string;
    price: number;
    quantity: number;
    amount: number;
}

export type Plan = {
  id: string // UUID
  name: string
  description: string
  cta: string // call to action
  highlighted: boolean
  price: number
  billing_cycle: 'monthly' | 'yearly' | string // tu peux restreindre si tu veux
  event_limit: number | null
  ticket_limit: number | null
  features: string[] // JSON[] dans Supabase = string[]
  created_at: string // ISO string (timestamp)
  updated_at: string // ISO string (timestamp)
}