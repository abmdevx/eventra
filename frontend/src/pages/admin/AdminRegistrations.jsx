import { useEffect, useMemo, useState } from "react";
import { registrationsApi } from "../../lib/endpoints";
import { formatDateTime } from "../../lib/format";
import {
  Badge,
  Card,
  EmptyState,
  Input,
  SearchIcon,
  Spinner,
  TicketIcon,
} from "../../components/shared";

const statusTone = { confirmed: "success", pending: "warning", cancelled: "neutral" };

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await registrationsApi.getAll();
        if (mounted) setRegistrations(data || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load activity");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const activities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...registrations]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )
      .filter((registration) => {
        if (!normalizedQuery) return true;
        const searchableText = [
          registration.user?.name,
          registration.user?.email,
          registration.event?.title,
          registration.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      });
  }, [registrations, query]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Activity
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            View registration and cancellation activity across all users.
          </p>
        </div>
        <div className="relative">
          <SearchIcon
            width={16}
            height={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <Input
            aria-label="Search activity"
            placeholder="Search users or events..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9 sm:w-72"
          />
        </div>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState
          icon={<TicketIcon width={22} height={22} />}
          title="Something went wrong"
          description={error}
        />
      )}

      {!loading && !error && activities.length === 0 && (
        <EmptyState
          icon={<TicketIcon width={22} height={22} />}
          title={query ? "No matching activity" : "No activity yet"}
          description={
            query
              ? "Try searching by user, email, event, or status."
              : "Registration and cancellation activity will appear here."
          }
        />
      )}

      {!loading && !error && activities.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Activity time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {activities.map((registration) => (
                  <tr key={registration._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="font-medium text-zinc-200">
                        {registration.user?.name || "User removed"}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {registration.user?.email || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-300">
                      {registration.event?.title || "Event removed"}
                    </td>
                    <td className="px-5 py-3 text-zinc-500">
                      {formatDateTime(registration.updatedAt || registration.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[registration.status] || "neutral"}>
                        {registration.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
