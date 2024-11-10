import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await db.query.locations.findMany();

  return Response.json(locations);
}
