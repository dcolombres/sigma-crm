import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import ical from 'node-ical';
import { RRule } from 'rrule';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user || !user.caldav_url || !user.caldav_username || !user.caldav_password) {
    return NextResponse.json({ error: 'CalDAV URL, username, or password not configured.' }, { status: 401 });
  }

  const { caldav_url, caldav_username, caldav_password } = user;

  try {
    const auth = Buffer.from(`${caldav_username}:${caldav_password}`).toString('base64');
    
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');
    const now = dateStr ? new Date(dateStr) : new Date();

    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diffToMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);

    const toCalDavFormat = (date) => {
        return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    };

    const startDateStr = toCalDavFormat(startOfWeek);
    const endDateStr = toCalDavFormat(endOfWeek);

    const response = await fetch(caldav_url, {
      method: 'REPORT',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${auth}`,
        'Depth': '1',
      },
      body: `<?xml version="1.0" encoding="utf-8" ?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT">
        <C:time-range start="${startDateStr}" end="${endDateStr}"/>
      </C:comp-filter>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CalDAV error:", errorText);
      return NextResponse.json({ error: 'Failed to fetch calendar events from CalDAV.' }, { status: response.status });
    }

    const data = await response.text();

    const regex = /<C:calendar-data[^>]*>([\s\S]*?)<\/C:calendar-data>/g;
    let matches;
    const allIcsData = [];
    while ((matches = regex.exec(data)) !== null) {
      allIcsData.push(matches[1].trim());
    }

    let allEvents = {};
    for (const ics of allIcsData) {
      const parsed = ical.parseICS(ics);
      allEvents = { ...allEvents, ...parsed };
    }

    const events = allEvents;
    const occurrences = [];

    for (const key in events) {
      if (events.hasOwnProperty(key)) {
        const event = events[key];
        if (event.type === 'VEVENT') {
          const title = event.summary;
          const start = new Date(event.start);
          const end = new Date(event.end);

          if (event.rrule) {
            const rule = new RRule({
              ...event.rrule.options,
              dtstart: start,
            });
            const dates = rule.between(startOfWeek, endOfWeek, true);

            dates.forEach(date => {
              const duration = end.getTime() - start.getTime();
              occurrences.push({
                summary: title,
                start: date,
                end: new Date(date.getTime() + duration),
              });
            });
          } else {
            if (start >= startOfWeek && start <= endOfWeek) {
              occurrences.push({
                summary: title,
                start: start,
                end: end,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ events: occurrences });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}