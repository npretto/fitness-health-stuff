import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

configDotenv();



const client = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
});

export const getDb = async () => {
  await client.connect();

  return drizzle(client);
}


export const db = await getDb()