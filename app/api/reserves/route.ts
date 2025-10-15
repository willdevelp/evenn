import { type NextRequest } from "next/server";
import postgres from "postgres";


const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
});

export async function GET() {
    try {
        const reserves = await sql`
            SELECT * FROM reserves
        `;
        return Response.json(reserves, { status: 200 });
    } catch (error) {
        console.error("Erreur GET /api/reserves:", error);
        return Response.json({ error: "Impossible de récupérer les réservations" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {

        const formData = await request.formData();

        const event_title = formData.get("title") as string;
        const price = parseInt(formData.get("price") as string);
        const quantity = parseInt(formData.get("quantity") as string);
        const amount = price * quantity;

        const reserve = await sql`
            INSERT INTO reserves (title, price, quantity, amount)
            VALUES (${event_title}, ${price}, ${quantity}, ${amount})
            RETURNING *
        `;

        return Response.json(reserve[0], { status: 201 });
    } catch (error) {
        console.error("Erreur POST /api/reserves:", error);
        return Response.json({ error: "Impossible de créer la reservation" }, { status: 500 });
    }
}
