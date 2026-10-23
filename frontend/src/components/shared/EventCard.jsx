import { Link } from "react-router-dom";
import Card from "./Card";
import Badge from "./Badge";
import { CalendarIcon, MapPinIcon, UsersIcon } from "./Icons";
import { formatDate } from "../../lib/format";

export default function EventCard({ event }) {
  const isPast = new Date(event.date) < new Date();
  const eventDate = new Date(event.date);
  const day = eventDate.toLocaleDateString(undefined, { day: "2-digit" });
  const month = eventDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase();

  return (
    <Card hover className="group flex flex-col overflow-hidden rounded-xl">
      <div className="relative h-20 bg-gradient-to-br from-brand-900/60 via-surface-2 to-surface-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.25),_transparent_60%)]" />
        <div className="absolute bottom-3 left-4 flex h-11 w-11 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 shadow-inner">
          <span className="text-[9px] font-bold tracking-wider text-brand-300">{month}</span>
          <span className="font-display text-lg font-bold leading-none text-white">{day}</span>
        </div>
        <div className="absolute right-3 top-2.5">
          <Badge tone={isPast ? "neutral" : "brand"}>{isPast ? "Past" : "Upcoming"}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-display text-base font-semibold text-zinc-100 line-clamp-1">
          {event.title}
        </h3>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CalendarIcon width={13} height={13} className="shrink-0 text-brand-400" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon width={13} height={13} className="shrink-0 text-brand-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon width={13} height={13} className="shrink-0 text-brand-400" />
            <span>Capacity: {event.capacity}</span>
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          View details <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </Card>
  );
}
