import { neon } from "@neondatabase/serverless";

export const getEvents = async (userId: string) => {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`SELECT * FROM event WHERE "userId" = ${userId}`;
    return response;
}