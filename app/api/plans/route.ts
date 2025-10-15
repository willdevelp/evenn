import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
});

export async function GET() {

    try {
      const plans = await sql`
        SELECT * FROM plans
      `;
  
      return Response.json(plans, { status: 200 });
    } catch (error) {
      console.error("Erreur GET /api/plans:", error);
      return Response.json({ error: "Impossible de récupérer les plans" }, { status: 500 });
    }
}