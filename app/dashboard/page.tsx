import { getUser } from "@/lib/auth-server";
import { neon } from "@neondatabase/serverless"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import Image from "next/image"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getEvents } from "@/lib/data";
import { CarouselEvents } from "@/components/ui/carouselEvents";
import { Search } from "lucide-react";

export default async function DashboardPage() {
    const user = await getUser();
    const userId = user?.id;
    const events = await getEvents(userId!);

    return (
        <div className="space-y-4 mt-4">
            <div className="flex gap-2 px-2">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2"/>
                    <Input type="search" placeholder="Rechercher un événement" className="pl-10" />
                </div>
                <Link href="/dashboard/add">
                    <Button className="py-5">
                        <Plus />
                        Ajouter un évènement
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col gap-2 px-2 py-2">
                <div className="">
                    <CarouselEvents events={events} />
                </div>
            </div>
        </div>
    )
}