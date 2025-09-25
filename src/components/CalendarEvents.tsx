'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  summary: string;
  start: Date;
  end: Date;
}

export function CalendarEvents({ refreshing }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('work_week');

  const fetchEvents = useCallback(async (fetchDate: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/caldav/events?date=${fetchDate.toISOString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch calendar events');
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(date);
  }, [date, fetchEvents]);

  useEffect(() => {
    if (refreshing) {
      fetchEvents(date);
    }
  }, [refreshing, date, fetchEvents]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleView = (newView: View) => {
    setView(newView);
  };

  const minTime = new Date();
  minTime.setHours(8, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(19, 0, 0);

  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        <Link href="/settings" className="text-blue-500 hover:underline">
          Configure your CalDAV credentials
        </Link>
      </div>
    );
  }

  const transformedEvents = events.map(event => ({
    title: event.summary,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={transformedEvents}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
          views={['month', 'work_week', 'day']}
          min={minTime}
          max={maxTime}
          style={{ height: '100%' }}
        />
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && transformedEvents.length === 0 && <p>No events for this period.</p>}
    </div>
  );
}
