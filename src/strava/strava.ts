import { readFileSync, writeFileSync } from "fs";
import { Hono } from "hono";
import strava, { Strava } from 'strava-v3'
import { Activity, StravaActivity } from "./strava-types";
import { HTTPException } from "hono/http-exception";
import { streamText } from "hono/streaming";
import { getDb } from "../db";
import { workouts } from "../db/schema";
import { Err, Ok, Result } from "ts-results";

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

  const activitiesResult = await getActivities(tokens.accessToken!)

  if (!activitiesResult.ok) {
    const url = await strava.oauth.getRequestAccessURL({ scope: "activity:read_all" })
    return c.redirect(url)
  }

  const activities = activitiesResult.val;

  return streamText(c, async (stream) => {

    const db = await getDb();
    await stream.writeln("Refresh token found, fetching activities...")

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


const getActivities = async (accessToken: string): Promise<Result<Activity[], 'invalid_access_token' | any>> => {
  // @ts-expect-error
  const client: Strava = new strava.client(accessToken);
  try {

    const activities: StravaActivity[] = await client.athlete.listActivities({ per_page: 200 })
    const withoutId: Activity[] = activities.map(activity => ({ ...activity, strava_id: activity.id, id: undefined }))
    return Ok(withoutId)
  }
  catch (ex: any) {
    console.log('getActivities error', ex)
    if (ex.statusCode === 401) {
      return Err('invalid_access_token')
    }
    return Err(ex)
  }
}



export { stravaRoutes }