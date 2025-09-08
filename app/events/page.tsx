"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/definition";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/src/components/ui/carousel"
import { Card, CardContent } from "@/src/components/ui/card"
import Link from "next/link"
import Image from "next/image";

export default function EventsPage() {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch("/api/events");
            const data = await response.json();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <h1>Events</h1>
            <div>
                <Carousel className="w-6/7 mx-auto">
                    <CarouselContent>
                        {events.map((event) => (
                            <CarouselItem key={event.id}>
                                <Link href={`/events/${event.title}`}>
                                    <Card className="w-full">
                                        <CardContent>
                                            <div className="flex justify-between space-x-4 ">
                                                <div className="w-full bg-gray-200">
                                                    <Image src={event.image} alt={event.title} className="w-full h-[400px]" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}
