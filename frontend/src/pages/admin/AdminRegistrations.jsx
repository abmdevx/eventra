import { useEffect, useMemo, useState } from "react";
import { registrationsApi } from "../../lib/endpoints";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../lib/format";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  SearchIcon,
  Spinner,
  TicketIcon,
  TrashIcon,
} from "../../components/shared";

const statusTone = { confirmed: "success", pending: "warning", cancelled: "neutral" };

export default function AdminRegistrations() {
  const { can } = useAuth();
  const canRead = can("registrations", "read");
  const canUpdate = can("registrations", "update");
  const canDelete = can("registrations", "delete");
  const [registrations, setRegistrations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!canRead) {
        setLoading(false);
        return;
      }
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
  }, [canRead]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await registrationsApi.remove(deleteTarget._id);
      setRegistrations((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Could not delete registration");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (registration, status) => {
    setUpdating(registration._id);
    try {
      const updated = await registrationsApi.update(registration._id, { status });
      setRegistrations((current) =>
        current.map((item) => item._id === registration._id ? { ...item, ...updated } : item)
      );
    } catch (err) {
      setError(err.message || "Could not update registration");
    } finally {
      setUpdating("");
    }
  };

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
            User activity
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

      {!loading && !error && !canRead && (
        <EmptyState
          icon={<TicketIcon width={22} height={22} />}
          title="Registration list access is disabled"
          description="This page requires registration read permission."
        />
      )}

      {!loading && !error && canRead && activities.length === 0 && (
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

      {!loading && !error && canRead && activities.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Activity time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  {(canUpdate || canDelete) && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {activities.map((registration) => (
                  <tr key={registration._id} className="transition-colors hover:bg-white/2">
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
                      {canUpdate ? (
                        <select
                          value={registration.status}
                          disabled={updating === registration._id}
                          onChange={(event) => handleStatusUpdate(registration, event.target.value)}
                          className="rounded-lg border border-surface-border bg-surface-2 px-2 py-1 text-xs text-zinc-200"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        <Badge tone={statusTone[registration.status] || "neutral"}>
                          {registration.status}
                        </Badge>
                      )}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="px-5 py-3 text-right">
                        {canDelete && (
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(registration)}>
                            <TrashIcon width={13} height={13} />
                            Delete
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete registration"
        message={`Delete ${deleteTarget?.user?.name || "this user's"} registration for ${deleteTarget?.event?.title || "this event"}?`}
        confirmLabel="Delete registration"
      />
    </div>
  );
}
