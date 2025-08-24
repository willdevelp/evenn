"use server"

import { neon } from '@neondatabase/serverless';

export async function getServerSideProps({ query }: { query: { id: string } } ) {

    const sql = neon(process.env.DATABASE_URL!);
    const { id } = query;

    const response = await sql`SELECT * FROM event WHERE userId = id`;
    
    return { props: { data: response[0].version } };
  }