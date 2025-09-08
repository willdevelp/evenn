import { type NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
});

export async function GET() {

    try {
      const events = await sql`
        SELECT e.id, e.title, e.description, e.location, e.date, e.time, e.image, e.place,
               COALESCE(array_agg(p.price), '{}') AS prices
        FROM events e
        LEFT JOIN prices p ON e.id = p.event_id
        GROUP BY e.id, e.title, e.description, e.location, e.date, e.time, e.image, e.place
        ORDER BY e.date ASC
      `;
  
      return Response.json(events, { status: 200 });
    } catch (error) {
      console.error("Erreur GET /api/events:", error);
      return Response.json({ error: "Impossible de récupérer les événements" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const image = formData.get("image") as string;
    const prices = (formData.get("prices") as string)
        ?.split(",") // ex: "5000,10000,20000"
        .map((p) => parseInt(p.trim(), 10))
        .filter((p) => !isNaN(p));
    const place = parseInt(formData.get("place") as string, 10);

    // 1️⃣ Insertion de l'événement
    const [event] = await sql`
    INSERT INTO events (title, description, location, date, time, image, place)
    VALUES (${title}, ${description}, ${location}, ${date}, ${time}, ${image}, ${place})
    RETURNING id
  `;

    const eventId = event.id;

    // 2️⃣ Insertion des prix liés à cet événement
    if (prices && prices.length > 0) {
        for (const price of prices) {
            await sql`
        INSERT INTO prices (event_id, price)
        VALUES (${eventId}, ${price})
      `;
        }
    }

    return Response.json(event, { status: 200});
}