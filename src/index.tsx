import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { stravaRoutes } from "./strava";
import { logger } from "hono/logger";
import { configDotenv } from "dotenv";

configDotenv();

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.html(
    <>
      <a href="/strava">Strava</a>
    </>
  );
});

app.route("/strava", stravaRoutes);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3456;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
