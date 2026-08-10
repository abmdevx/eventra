import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, CalendarIcon, SparklesIcon, TicketIcon, ShieldIcon } from "../components/shared";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      <section className="flex flex-col items-center py-14 text-center sm:py-20">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-900 bg-brand-950/50 px-3 py-1 text-xs font-medium text-brand-300">
          <SparklesIcon width={13} height={13} />
          AI-assisted event descriptions
        </span>
        <h1 className="font-display max-w-2xl text-3xl font-bold leading-tight text-zinc-50 sm:text-5xl">
          Find events. Reserve your spot.{" "}
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            Effortlessly.
          </span>
        </h1>
        <p className="mt-4 max-w-lg text-sm text-zinc-500 sm:text-base">
          Eventra is a clean front end for the Event Registration System API — browse events,
          register in a click, and track everything from one dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to="/events" size="lg">
            Browse events
          </Button>
          {!isAuthenticated && (
            <Button as={Link} to="/register" variant="secondary" size="lg">
              Create an account
            </Button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-3">
        <Card className="p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950/60 text-brand-400">
            <CalendarIcon width={18} height={18} />
          </div>
          <h3 className="font-display font-semibold text-zinc-100">Browse events</h3>
          <p className="mt-1.5 text-sm text-zinc-500">
            Search and filter upcoming or past events by title.
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950/60 text-brand-400">
            <TicketIcon width={18} height={18} />
          </div>
          <h3 className="font-display font-semibold text-zinc-100">One-click registration</h3>
          <p className="mt-1.5 text-sm text-zinc-500">
            Reserve a spot instantly and track your registration status.
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950/60 text-brand-400">
            <ShieldIcon width={18} height={18} />
          </div>
          <h3 className="font-display font-semibold text-zinc-100">Admin controls</h3>
          <p className="mt-1.5 text-sm text-zinc-500">
            Manage events, users, and registrations from a dedicated dashboard.
          </p>
        </Card>
      </section>
    </div>
  );
}
