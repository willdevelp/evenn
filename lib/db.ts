import { Pool, type PoolClient } from "pg";

// Le pool distant en mode session a une limite globale basse ; chaque prerender worker
// doit garder une seule connexion et la partager avec les requêtes concurrentes.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

globalForPg.pgPool = pool;

/** Exécute fn dans une transaction : COMMIT si ça réussit, ROLLBACK si ça lève une erreur. */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
