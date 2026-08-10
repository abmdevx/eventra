import { Link } from "react-router-dom";
import Card from "./Card";
import Badge from "./Badge";
import { CalendarIcon, MapPinIcon, UsersIcon } from "./Icons";
import { formatDate } from "../../lib/format";

export default function EventCard({ event }) {
  const isPast = new Date(event.date) < new Date();

  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <div className="relative h-28 bg-gradient-to-br from-brand-900/50 via-surface-2 to-surface-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.25),_transparent_60%)]" />
        <div className="absolute right-3 top-3">
          <Badge tone={isPast ? "neutral" : "brand"}>{isPast ? "Past" : "Upcoming"}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold text-zinc-100 line-clamp-1">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-500">{event.description}</p>

        <div className="mt-1 flex flex-col gap-1.5 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CalendarIcon width={14} height={14} />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon width={14} height={14} />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon width={14} height={14} />
            Capacity: {event.capacity}
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          View details →
        </Link>
      </div>
    </Card>
  );
}
