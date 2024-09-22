import { NextRequest } from "next/server";
import { db } from "@/server/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get("date");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!date || !month || !year) {
    return Response.json({ message: "Provide vavlid date" });
  }

  const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));

  const meetings = await db.query.meetings.findMany({
    where: (meetings, { eq }) => eq(meetings.date, newDate),
  });

  return Response.json(meetings);
}
