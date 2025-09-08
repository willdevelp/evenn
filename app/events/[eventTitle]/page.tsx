
import { Dialog } from "@/src/components/ui/dialog"
import ReserveForm from "@/src/components/ui/reserve-form";
import Image from "next/image";

export default async function EventTitlePage({ params }: { params: { eventTitle: string } }) {
    
    const { eventTitle } = await params; 
    const url = process.env.NEXT_PUBLIC_BASE_URL;
  
    const response = await fetch(`${url}/api/events/${eventTitle}`, {
      cache: "no-store",
    });
  
    if (!response.ok) {
      throw new Error("Event not found");
    }
  
    const data = await response.json();

  
    return (
      <div className="space-y-2 px-2">
        <div className="border space-y-2 p-2 rounded">
          <h1 className="font-bold text-center">{data.title}</h1>
          <div className="space-y-2">
            <p>{data.description}</p>
            <div className="flex justify-between">
                <p> <span className="font-bold">Lieu:</span> {data.location}</p>
                <p><span className="font-bold">Date:</span> {data.date}</p>
                <p><span className="font-bold">Heure:</span> {data.time}</p>
                <p><span className="font-bold">Prix:</span> {data.prices?.join(" ")}</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-2">
          <Image src={data.image} alt={data.title} className="w-full h-[400px] bg-gray-200"/>
          <Dialog>
            <ReserveForm data={data}/>
          </Dialog>
        </div>
      </div>
    );
  }  