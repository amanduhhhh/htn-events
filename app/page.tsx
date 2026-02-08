"use client";

import { useEffect, useState } from "react";
import { fetchEvents, TEvent } from "@/lib/api";
import { EventCard } from "@/components/EventCard";

interface GroupedEvents {
  date: string;
  events: TEvent[];
}

function formatDateHeader(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function groupEventsByDate(events: TEvent[]): GroupedEvents[] {
  const grouped = new Map<string, TEvent[]>();

  events.forEach((event) => {
    const date = new Date(event.start_time);
    const dateKey = date.toLocaleDateString("en-US");

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });

  const result: GroupedEvents[] = [];
  grouped.forEach((eventsList, dateKey) => {
    const sortedEvents = eventsList.sort((a, b) => a.start_time - b.start_time);
    result.push({
      date: formatDateHeader(eventsList[0].start_time),
      events: sortedEvents,
    });
  });

  result.sort((a, b) => {
    return a.events[0].start_time - b.events[0].start_time;
  });

  return result;
}

export default function Home() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const fetchedEvents = await fetchEvents();
        
        const sortedEvents = fetchedEvents.sort(
          (a, b) => a.start_time - b.start_time
        );

        const filteredEvents = isAuthenticated
          ? sortedEvents
          : sortedEvents.filter((event) => event.permission === "public");

        const grouped = groupEventsByDate(filteredEvents);
        setGroupedEvents(grouped);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-light-blue text-lg font-medium">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-pink text-lg font-medium">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Hack the North Events
          </h1>
          <p className="text-light-blue font-medium">
            {isAuthenticated
              ? "Viewing all events"
              : "Viewing public events only"}
          </p>
        </header>

        {groupedEvents.length === 0 ? (
          <div className="text-center text-yellow py-12 text-lg">
            No events found.
          </div>
        ) : (
          <div className="space-y-10">
            {groupedEvents.map((group) => (
              <div key={group.date}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {group.date}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
