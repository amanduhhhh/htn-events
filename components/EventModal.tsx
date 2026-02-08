"use client";

import { useRef, useEffect } from "react";
import { TEvent } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventModalProps {
  event: TEvent | null;
  allEvents: TEvent[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: TEvent) => void;
  isAuthenticated: boolean;
}

function formatTimeRange(startTime: number, endTime: number): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const dateStr = start.toLocaleDateString("en-US", dateOptions);
  const startTimeStr = start.toLocaleTimeString("en-US", timeOptions);
  const endTimeStr = end.toLocaleTimeString("en-US", timeOptions);

  return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
}

function formatEventType(eventType: string): string {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function EventModal({
  event,
  allEvents,
  isOpen,
  onClose,
  onEventClick,
  isAuthenticated,
}: EventModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [event]);

  if (!event) return null;

  const eventTypeColors = {
    workshop: "text-pink",
    activity: "text-orange",
    tech_talk: "text-green",
  };

  const relatedEvents = event.related_events
    .map((id) => allEvents.find((e) => e.id === id))
    .filter((e): e is TEvent => e !== undefined)
    .filter((e) => isAuthenticated || e.permission === "public");

  const eventUrl = event.public_url || event.private_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-0 max-w-5xl h-screen sm:h-auto sm:max-h-[85vh] p-0 flex flex-col top-0 sm:top-[50%] translate-y-0 sm:translate-y-[-50%] rounded-none sm:rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader className="px-8 pt-10 pb-4 sm:px-10 sm:pt-12 sm:pb-6 shrink-0 text-left">
          <DialogDescription className="sr-only">
            Event details for {event.name}
          </DialogDescription>
          <div
            className={`text-xs font-semibold uppercase tracking-wide ${eventTypeColors[event.event_type]}`}
          >
            {formatEventType(event.event_type)}
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground leading-tight mt-1">
            {event.name}
          </DialogTitle>
          <p className="text-yellow font-medium mt-1 text-sm">
            {formatTimeRange(event.start_time, event.end_time)}
          </p>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1 px-8 sm:px-10 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="space-y-8 pt-0 pb-6 sm:pt-0 sm:pb-8">
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 uppercase tracking-wide">
                  Speakers
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.speakers.map((speaker, index) => (
                    <span
                      key={index}
                      className="text-foreground bg-background px-4 py-2 rounded-lg text-base font-medium"
                    >
                      {speaker.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.description && (
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-foreground/90 leading-relaxed text-base">
                  {event.description}
                </p>
              </div>
            )}

            {eventUrl && (
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 uppercase tracking-wide">
                  Event Link
                </h3>
                <a
                  href={eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-blue hover:text-light-blue/80 underline break-all text-base"
                >
                  {eventUrl}
                </a>
              </div>
            )}

            {relatedEvents.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-foreground mb-4 uppercase tracking-wide">
                  Related Events
                </h3>
                <div className="space-y-3">
                  {relatedEvents.map((relatedEvent) => (
                    <button
                      key={relatedEvent.id}
                      onClick={() => onEventClick(relatedEvent)}
                      className="block w-full text-left p-4 bg-background hover:bg-background/70 rounded-lg transition-colors"
                    >
                      <div
                        className={`text-xs font-semibold uppercase tracking-wide mb-2 ${eventTypeColors[relatedEvent.event_type]}`}
                      >
                        {formatEventType(relatedEvent.event_type)}
                      </div>
                      <p className="text-foreground font-semibold text-base mb-1">
                        {relatedEvent.name}
                      </p>
                      <p className="text-foreground/60 text-sm">
                        {formatTimeRange(
                          relatedEvent.start_time,
                          relatedEvent.end_time,
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="sticky bottom-0 h-12 bg-card pointer-events-none"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
