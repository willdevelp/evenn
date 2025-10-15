"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EventForm() {
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
            className=" mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-100"
        >
            {/* En-tête */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un événement</h2>
                <p className="text-gray-600">Remplissez les informations pour créer votre événement</p>
            </div>

            {/* Première ligne : Titre et Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Titre */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="title">
                        Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Titre de l'événement"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                        placeholder="Décrivez brièvement l'événement"
                    />
                </div>
            </div>

            {/* Deuxième ligne : Date et Heure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="date">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Heure */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="time">
                        Heure <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
            </div>

            {/* Troisième ligne : Lieu et Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lieu */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="location">
                        Lieu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Lieu de l'événement"
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="image">
                        Image (URL)
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="https://exemple.com/image.jpg"
                    />
                </div>
            </div>

            {/* Quatrième ligne : Prix et Places */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prix */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="prices">
                        Prix (séparés par des virgules)
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: 5000, 10000"
                        id="prices"
                        name="prices"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Places */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="place">
                        Nombre de places <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        id="place"
                        name="place"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Ex: 100"
                    />
                </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Création en cours...
                        </span>
                    ) : (
                        "Créer l'événement"
                    )}
                </button>
            </div>
        </form>
    );
}