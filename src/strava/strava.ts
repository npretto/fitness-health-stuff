import { readFileSync, writeFileSync } from "fs";
import { Hono } from "hono";
import strava, { Strava } from 'strava-v3'
import { Activity } from "./strava-types";
import { HTTPException } from "hono/http-exception";
import { streamText } from "hono/streaming";
import { db } from "../db";
import { workouts } from "../db/schema";


const stravaRoutes = new Hono()


stravaRoutes.get('/', async (c) => {
  const tokens = readTokens()
  console.log(tokens)
  if (!tokens.refreshToken) {
    console.log('No refresh token')
    throw new HTTPException(400, { message: 'No refresh token' })
  }

  if (!tokens.accessToken) {
    const url = await strava.oauth.getRequestAccessURL({ scope: "activity:read_all" })
    return c.redirect(url)
  }

  return streamText(c, async (stream) => {
    await stream.writeln("Refresh token found, fetching activities...")

    //TODO: catch token expired error and redirect to callback
    const activities = await getActivities(tokens.accessToken!)

    await stream.writeln(`Found ${activities.length} activities`)

    // @ts-expect-error - ???
    const result = await db.insert(workouts).values(activities)
      .onConflictDoNothing({ target: workouts.strava_id }).execute()

    await stream.writeln(`Inserted ${result.rowCount} new activities`)

    stream.writeln("");
    stream.writeln("-----------------------------");

    activities.forEach((activity) => {
      stream.writeln(`${activity.start_date_local} - ${activity.name} - ${activity.distance}m - ${activity.location_city}`)
    })


  })
})


stravaRoutes.get('/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.text('No code', 400)
  const payload = await strava.oauth.getToken(code)
  writeTokens({ accessToken: payload.access_token, refreshToken: payload.refresh_token })

  return c.redirect('/strava')
})

type Tokens = {
  accessToken: string,
  refreshToken: string
}
const readTokens = (): Partial<Tokens> => {
  return JSON.parse(readFileSync('tokens.json', 'utf8'))
}
const writeTokens = (tokens: Tokens) => {
  writeFileSync('tokens.json', JSON.stringify(tokens, null, 2))
}


const getActivities = async (accessToken: string) => {
  // @ts-expect-error
  const client: Strava = new strava.client(accessToken);
  const activities: Activity[] = await client.athlete.listActivities({ per_page: 200 })
  return activities.map(activity => ({ ...activity, strava_id: activity.id, id: undefined }))
}



export { stravaRoutes }