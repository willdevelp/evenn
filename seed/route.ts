import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: "require"});

async function seedUsers(){
    await sql` 
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
}

async function seedEvents(){
    await sql` 
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            place VARCHAR(255) NOT NULL,
            nbreplace INT NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            organizerId VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
}

export async function GET(){
    try {
        const result = await sql.begin((sql) => [
            seedUsers(),
            seedEvents()
        ]);

        if(result){
            return Response.json({ message: 'Database seeded successfully' });
        }
    } catch (error) {
        console.error('Seeding error:', error);
        return Response.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}