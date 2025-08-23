"use server"
import { neon } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth-server"

const sql = neon(process.env.DATABASE_URL!);

export default async function createEvent(formData: FormData) {

        const user = await getUser();
        const name = formData.get("name")
        const description = formData.get("description")
        const date = formData.get("date")
        const time = formData.get("time")
        const location = formData.get("location")
        const price = formData.get("price")
        const type = formData.get("type")
        const image = formData.get("image")
        const userId = user?.id

        await sql`INSERT INTO event (name, description, date, time, location, price, type, image, userId) VALUES (${name}, ${description}, ${date}, ${time}, ${location}, ${price}, ${type}, ${image}, ${userId})`
    }