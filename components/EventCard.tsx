import { TEvent } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventCardProps {
  event: TEvent;
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

function truncateDescription(
  description: string | undefined,
  maxLength: number = 150,
): string {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

export function EventCard({ event }: EventCardProps) {
  const eventTypeColors = {
    workshop: "text-pink",
    activity: "text-orange",
    tech_talk: "text-green",
  };

  return (
    <Card className="bg-card border-dark-blue/30 hover:border-light-blue/50 transition-colors">
      <CardHeader>
        <div
          className={`text-xs font-semibold uppercase tracking-wide mb-2 ${eventTypeColors[event.event_type]}`}
        >
          {formatEventType(event.event_type)}
        </div>
        <CardTitle className="text-foreground">{event.name}</CardTitle>
        <CardDescription className="text-yellow">
          {formatTimeRange(event.start_time, event.end_time)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {event.description && (
          <p className="text-sm text-foreground/70">
            {truncateDescription(event.description)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
