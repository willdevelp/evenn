import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export const eventSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z.string().min(3, "La description doit contenir au moins 3 caractères"),
    date: z.date(),
    time: z.string().min(3, "L'heure doit contenir au moins 3 caractères"),
    location: z.string().min(3, "Le lieu doit contenir au moins 3 caractères"),
    price: z.array(z.number()),
    type: z.string().min(3, "Le type doit contenir au moins 3 caractères"),
    image: z.string().min(3, "L'image doit contenir au moins 3 caractères"),
})

export const eventSchemaResolver = zodResolver(eventSchema);


