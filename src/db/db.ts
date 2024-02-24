import { configDotenv } from "dotenv";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

configDotenv();



const client = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
});


let _db: NodePgDatabase<Record<string, never>> | null = null

export const getDb = async () => {
  if (_db) return _db;
  await client.connect();

  _db = drizzle(client);

  return _db;

}


// export const db = await getDb()