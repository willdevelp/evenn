'use server';

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';

const sql = neon(`${process.env.DATABASE_URL}`);


export async function register(formData: FormData){
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
    }

    const hash = await bcrypt.hash(password, 10);
    
    try {
        await sql`
            INSERT INTO users (name, email, role, password)
            VALUES (${name}, ${email}, ${role}, ${hash})
            RETURNING *`;
        // No need to return anything, which implicitly returns void
    } catch (error) {
        throw new Error('Failed to register user');
    }

    redirect('/login');
}

