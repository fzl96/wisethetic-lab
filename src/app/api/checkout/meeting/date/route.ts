import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { startOfDay, endOfDay } from "date-fns";

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
    where: (meetings, { gte, lte, and }) =>
      and(
        gte(meetings.date, startOfDay(newDate)),
        lte(meetings.date, endOfDay(newDate)),
      ),
  });

  const meetingDates = meetings.map((meeting) => ({
    date: meeting.date,
    hour: meeting.date.getHours(),
  }));

  return Response.json(meetingDates);
}
