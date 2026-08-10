import { useEffect, useMemo, useState } from "react";
import { eventsApi } from "../lib/endpoints";
import {
  EventCard,
  EmptyState,
  Spinner,
  Input,
  Select,
  SearchIcon,
  CalendarIcon,
} from "../components/shared";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await eventsApi.getAll();
        if (mounted) setEvents(data || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load events");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
      .filter((e) => {
        if (filter === "upcoming") return new Date(e.date) >= now;
        if (filter === "past") return new Date(e.date) < now;
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, query, filter]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Discover events
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Browse what's happening and reserve your spot before capacity runs out.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <SearchIcon
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <Input
              placeholder="Search events…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 sm:w-56"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-36">
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </Select>
        </div>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState
          icon={<CalendarIcon width={22} height={22} />}
          title="Couldn't load events"
          description={error}
        />
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={<CalendarIcon width={22} height={22} />}
          title="No events found"
          description="Try adjusting your search or check back later for new events."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
