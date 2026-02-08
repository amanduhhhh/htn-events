"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchEvents, TEvent } from "@/lib/api";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

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
    <div className="min-h-screen py-8 px-8 sm:py-12 sm:px-12 lg:px-16 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Hack the North Events
            </h1>
            <p className="text-sm sm:text-base text-light-blue font-medium">
              {isAuthenticated
                ? "Viewing all events"
                : "Viewing public events only"}
            </p>
          </div>
          {!isAuthenticated ? (
            <Link href="/login">
              <Button className="bg-pink hover:bg-pink/80 text-background font-semibold shrink-0">
                <span className="hidden sm:inline">Hacker Login</span>
                <span className="sm:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </span>
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-orange hover:bg-orange/80 text-background font-semibold shrink-0"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
            </Button>
          )}
        </header>

        {groupedEvents.length === 0 ? (
          <div className="text-center text-yellow py-12 text-lg">
            No events found.
          </div>
        ) : (
          <div className="space-y-10">
            {groupedEvents.map((group) => (
              <div key={group.date}>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {group.date}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
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
