import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: "require"});

export async function register(data: {name: string, email: string, password: string, role: string}) {
    const hash = await bcrypt.hash(data.password, 10);
    const result = await sql`
        INSERT INTO users (name, email, role, password)
        VALUES (${data.name}, ${data.email}, ${data.role}, ${hash})
        RETURNING *
    `;
    return result[0];
}

export async function login(data: {email: string, password: string}) {
    const result = await sql`
        SELECT * FROM users
        WHERE email = ${data.email}
    `;
    if(!result[0]) {
        throw new Error('Invalid email or password');
    }
    const valid = await bcrypt.compare(data.password, result[0].password);
    if(!valid) {
        throw new Error('Invalid email or password');
    }
    return result[0];
}
