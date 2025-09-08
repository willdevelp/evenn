"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EventForm() {

    // async function createEvent(formData: FormData) {
    //     "use server";

    //     const sql = postgres(process.env.DATABASE_URL!, {
    //         ssl: "require",
    //     });

    //     const title = formData.get("title") as string;
    //     const description = formData.get("description") as string;
    //     const location = formData.get("location") as string;
    //     const date = formData.get("date") as string;
    //     const time = formData.get("time") as string;
    //     const image = formData.get("image") as string;
    //     const prices = (formData.get("prices") as string)
    //         ?.split(",") // ex: "5000,10000,20000"
    //         .map((p) => parseInt(p.trim(), 10))
    //         .filter((p) => !isNaN(p));
    //     const place = parseInt(formData.get("place") as string, 10);

    //     // 1️⃣ Insertion de l'événement
    //     const [event] = await sql`
    //     INSERT INTO events (title, description, location, date, time, image, place)
    //     VALUES (${title}, ${description}, ${location}, ${date}, ${time}, ${image}, ${place})
    //     RETURNING id
    //   `;

    //     const eventId = event.id;

    //     // 2️⃣ Insertion des prix liés à cet événement
    //     if (prices && prices.length > 0) {
    //         for (const price of prices) {
    //             await sql`
    //         INSERT INTO prices (event_id, price)
    //         VALUES (${eventId}, ${price})
    //       `;
    //         }
    //     }

    //     redirect("/dashboard/events");
    // }
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.currentTarget);
            const response = await fetch("/api/events", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to create event");
            }
            router.push("/dashboard/events");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 p-6 border-2 border-gray-200 shadow-md rounded w-full mx-auto"
        >
            <h2 className="text-2xl font-semibold text-center">Créer un événement</h2>

            <div className='flex justify-between gap-4'>
                {/* Titre */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="title">Titre</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Description */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <div className='flex justify-between gap-4'>
                {/* Date */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Heure */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="time">Heure</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <div className='flex justify-between gap-4'>
                {/* Lieu */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="location">Lieu</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Image */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="image">Image (URL)</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <div className='flex justify-between gap-4'>
                {/* Prix */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="prices">Prix (séparés par des virgules)</label>
                    <input
                        type="text"
                        placeholder="Ex: 5000, 10000"
                        id="prices"
                        name="prices"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Places */}
                <div className='w-1/2'>
                    <label className="block text-sm font-medium" htmlFor="place">Nombre de places</label>
                    <input
                        type="number"
                        min="1"
                        id="place"
                        name="place"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Création en cours..." : "Créer l’événement"}
            </button>
        </form>
    )
}
