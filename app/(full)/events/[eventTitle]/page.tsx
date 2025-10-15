import { Dialog } from "@/src/components/ui/dialog";
import ReserveForm from "@/src/components/ui/reserve-form";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEuroSign } from "react-icons/fa";

export default async function EventTitlePage({ params }: { params: { eventTitle: string } }) {
  const { eventTitle } = params;
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(`${url}/api/events/${eventTitle}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Event not found");
  }

  const data = await response.json();

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="h-[400px] w-full">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Détails */}
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-800">{data.title}</h1>
            <p className="text-gray-600">{data.description}</p>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" />
                <span className="font-medium">Lieu :</span> {data.location}
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-600" />
                <span className="font-medium">Date :</span> {new Date(data.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-indigo-600" />
                <span className="font-medium">Heure :</span> {data.time}
              </div>
              <div className="flex items-center gap-2">
                <FaEuroSign className="text-indigo-600" />
                <span className="font-medium">Prix :</span> {data.prices?.join(" € / ")} €
              </div>
              <div>
                <span className="font-medium">Places disponibles :</span> {data.place}
              </div>
            </div>

            <div className="pt-4">
              <Dialog>
                <ReserveForm data={data} />
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}