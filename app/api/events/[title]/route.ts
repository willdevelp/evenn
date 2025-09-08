import { type NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ title: string }> }) {

    const { title } = await params;

    if (!title) {
        return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const event = await sql`
    SELECT e.id, e.title, e.description, e.location, e.date, e.time, e.image, e.place,
           COALESCE(array_agg(p.price), '{}') AS prices
    FROM events e
    LEFT JOIN prices p ON e.id = p.event_id
    WHERE e.title = ${title}
    GROUP BY e.id, e.title, e.description, e.location, e.date, e.time, e.image, e.place
    ORDER BY e.date ASC
  `;

    return Response.json(event[0], { status: 200 });
}