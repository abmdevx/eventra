import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrationsApi } from "../lib/endpoints";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/format";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Spinner,
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
} from "../components/shared";

export default function MyRegistrations() {
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await registrationsApi.getMine();
      setRegistrations(data || []);
    } catch (err) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    try {
      await registrationsApi.update(cancelTarget._id, { status: "cancelled" });
      toast.success("Registration cancelled");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not cancel registration");
    } finally {
      setBusy(false);
    }
  };

  const statusTone = { confirmed: "success", pending: "warning", cancelled: "neutral" };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
          My registrations
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Everything you've registered for, in one place.</p>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState icon={<TicketIcon width={22} height={22} />} title="Something went wrong" description={error} />
      )}

      {!loading && !error && registrations.length === 0 && (
        <EmptyState
          icon={<TicketIcon width={22} height={22} />}
          title="No registrations yet"
          description="Browse upcoming events and reserve your spot."
          action={
            <Button as={Link} to="/events">
              Browse events
            </Button>
          }
        />
      )}

      {!loading && !error && registrations.length > 0 && (
        <div className="flex flex-col gap-3">
          {registrations.map((reg) => (
            <Card key={reg._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-zinc-100">
                    {reg.event?.title || "Event removed"}
                  </h3>
                  <Badge tone={statusTone[reg.status] || "neutral"}>{reg.status}</Badge>
                </div>
                {reg.event && (
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <CalendarIcon width={13} height={13} /> {formatDate(reg.event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon width={13} height={13} /> {reg.event.location}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {reg.event && (
                  <Button as={Link} to={`/events/${reg.event._id}`} variant="secondary" size="sm">
                    View event
                  </Button>
                )}
                {reg.status !== "cancelled" && (
                  <Button variant="danger" size="sm" onClick={() => setCancelTarget(reg)}>
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={busy}
        title="Cancel registration"
        message={`Cancel your registration for "${cancelTarget?.event?.title}"? This can't be undone.`}
        confirmLabel="Cancel registration"
      />
    </div>
  );
}
