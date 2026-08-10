import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi, registrationsApi } from "../lib/endpoints";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/format";
import {
  Badge,
  Button,
  Card,
  Spinner,
  EmptyState,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
} from "../components/shared";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registeredCount, setRegisteredCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const ev = await eventsApi.getById(id);
      setEvent(ev);
      if (isAuthenticated) {
        const mine = await registrationsApi.getMine();
        setMyRegistrations(mine || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const myRegistration = myRegistrations.find(
    (r) => r.event?._id === id && r.status !== "cancelled"
  );

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const res = await registrationsApi.create({ userId: user._id, eventId: id });
      setRegisteredCount(res.usedCapacity);
      toast.success("You're registered for this event!");
      load();
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!myRegistration) return;
    setRegistering(true);
    try {
      await registrationsApi.update(myRegistration._id, { status: "cancelled" });
      toast.success("Registration cancelled");
      load();
    } catch (err) {
      toast.error(err.message || "Could not cancel registration");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Spinner full />;

  if (error || !event) {
    return (
      <EmptyState
        icon={<CalendarIcon width={22} height={22} />}
        title="Event not found"
        description={error || "This event may have been removed."}
        action={
          <Button variant="secondary" onClick={() => navigate("/events")}>
            Back to events
          </Button>
        }
      />
    );
  }

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="animate-fade-in mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Back
      </button>

      <Card className="overflow-hidden">
        <div className="relative h-36 bg-gradient-to-br from-brand-900/60 via-surface-2 to-surface-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.3),_transparent_60%)]" />
          <div className="absolute right-4 top-4">
            <Badge tone={isPast ? "neutral" : "brand"}>{isPast ? "Past event" : "Upcoming"}</Badge>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            {event.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{event.description}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-surface-border bg-surface-2 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarIcon width={14} height={14} />
                Date
              </div>
              <div className="text-sm font-medium text-zinc-200">{formatDate(event.date)}</div>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-2 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <MapPinIcon width={14} height={14} />
                Location
              </div>
              <div className="text-sm font-medium text-zinc-200">{event.location}</div>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-2 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <UsersIcon width={14} height={14} />
                Capacity
              </div>
              <div className="text-sm font-medium text-zinc-200">
                {registeredCount !== null ? `${registeredCount} / ` : ""}
                {event.capacity} spots
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-surface-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {myRegistration ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <TicketIcon width={16} height={16} />
                You're registered — status:{" "}
                <Badge tone={myRegistration.status === "confirmed" ? "success" : "warning"}>
                  {myRegistration.status}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                {isPast ? "This event has already taken place." : "Reserve your spot below."}
              </p>
            )}

            {!isPast &&
              (isAuthenticated ? (
                myRegistration ? (
                  <Button variant="danger" onClick={handleCancel} loading={registering}>
                    Cancel registration
                  </Button>
                ) : (
                  <Button onClick={handleRegister} loading={registering}>
                    <TicketIcon width={16} height={16} />
                    Register now
                  </Button>
                )
              ) : (
                <Button onClick={() => navigate("/login")}>Log in to register</Button>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
