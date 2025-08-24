import * as React from "react"
// import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselEvents({ events }: { events: any[] }) {
    return (
        <div className="w-6/7 mx-auto">
            <Carousel>
                <CarouselContent>
                    {events.map((event: any) => (
                        <CarouselItem key={event.id}>
                            <Card className="">
                                <CardContent className="flex gap-2 space-x-4">
                                    <img
                                        src={event.image}
                                        alt={event.name}
                                        className="bg-gray-200 w-1/2 h-[350px]"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <p><strong>Nom :</strong> {event.name}</p>
                                        <p><strong>Description :</strong> {event.description}</p>
                                        <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
                                        <p><strong>Heure :</strong> {event.time}</p>
                                        <p><strong>Lieu :</strong> {event.location}</p>
                                        <p><strong>Prix :</strong> {event.price}</p>
                                        <p><strong>Type :</strong> {event.type}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}