import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi, registrationsApi } from "../lib/endpoints";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDateTime } from "../lib/format";
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

  const eventDate = new Date(event.date);
  const eventDay = eventDate.toLocaleDateString(undefined, { day: "2-digit" });
  const eventMonth = eventDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase();

  return (
    <div className="animate-fade-in mx-auto max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <span aria-hidden="true">←</span> Back to events
      </button>

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-surface-2 to-surface-1 px-6 py-7 sm:px-10 sm:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-red-900/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-black/25 shadow-xl backdrop-blur-sm">
                <span className="text-[10px] font-bold tracking-[0.2em] text-brand-300">{eventMonth}</span>
                <span className="font-display text-2xl font-bold leading-none text-white">{eventDay}</span>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-300/80">
                  Event details
                </p>
                <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
                  {event.title}
                </h1>
              </div>
            </div>
            <Badge tone={isPast ? "neutral" : "brand"}>{isPast ? "Past event" : "Upcoming"}</Badge>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
                About this event
              </p>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-surface-border bg-surface-2/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <CalendarIcon width={15} height={15} className="text-brand-400" />
                  Date and time
                </div>
                <div className="text-sm font-medium text-zinc-200">{formatDateTime(event.date)}</div>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface-2/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <MapPinIcon width={15} height={15} className="text-brand-400" />
                  Location
                </div>
                <div className="text-sm font-medium text-zinc-200">{event.location}</div>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface-2/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <UsersIcon width={15} height={15} className="text-brand-400" />
                  Capacity
                </div>
                <div className="text-sm font-medium text-zinc-200">
                  {registeredCount !== null ? `${registeredCount} / ` : ""}
                  {event.capacity} spots
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-2/60 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Your access
              </p>
              {myRegistration ? (
                <div className="mt-4 flex items-start gap-2 text-sm text-emerald-400">
                  <TicketIcon width={17} height={17} className="mt-0.5 shrink-0" />
                  <span>
                    You're registered
                    <span className="mt-1 block text-xs text-zinc-500">Your spot is reserved for this event.</span>
                  </span>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {isPast ? "This event has already taken place." : "Reserve your spot before capacity runs out."}
                </p>
              )}
            </div>

            <div className="mt-7">
              {!isPast &&
                (isAuthenticated ? (
                  myRegistration ? (
                    <Button variant="danger" onClick={handleCancel} loading={registering} className="w-full">
                      Cancel registration
                    </Button>
                  ) : (
                    <Button onClick={handleRegister} loading={registering} className="w-full">
                      <TicketIcon width={16} height={16} />
                      Register now
                    </Button>
                  )
                ) : (
                  <Button onClick={() => navigate("/login")} className="w-full">
                    Log in to register
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
