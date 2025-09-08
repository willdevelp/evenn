import * as z from "zod";

export const eventSchema = z.object({
    id: z.string(),
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Date invalide",
    }),
    time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Heure invalide"),
    location: z.string().min(3, "Le lieu doit contenir au moins 3 caractères"),
    image: z.string().url("URL d’image invalide"),
    prices: z.string().transform((val) =>
      val.split(",").map((p) => Number(p.trim())).filter((n) => !isNaN(n))
    ),
    place: z.coerce.number().min(1, "Le nombre de places doit être au moins 1"),
})