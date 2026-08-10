import { useEffect, useState } from "react";
import { eventsApi } from "../../lib/endpoints";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../lib/format";
import EventForm from "./EventForm";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Spinner,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "../../components/shared";

export default function AdminEvents() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await eventsApi.getAll();
      setEvents((data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const onSaved = () => {
    setFormOpen(false);
    toast.success(editingEvent ? "Event updated" : "Event created");
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await eventsApi.remove(deleteTarget._id);
      toast.success("Event deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not delete event");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Manage events
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Create, edit, and remove events.</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon width={16} height={16} />
          New event
        </Button>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState icon={<CalendarIcon width={22} height={22} />} title="Something went wrong" description={error} />
      )}

      {!loading && !error && events.length === 0 && (
        <EmptyState
          icon={<CalendarIcon width={22} height={22} />}
          title="No events yet"
          description="Create your first event to get started."
          action={<Button onClick={openCreate}>New event</Button>}
        />
      )}

      {!loading && !error && events.length > 0 && (
        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const isPast = new Date(event.date) < new Date();
            return (
              <Card key={event._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-semibold text-zinc-100">
                      {event.title}
                    </h3>
                    <Badge tone={isPast ? "neutral" : "brand"}>{isPast ? "Past" : "Upcoming"}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{event.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
                    <span>{formatDate(event.date)}</span>
                    <span>{event.location}</span>
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(event)}>
                    <EditIcon width={14} height={14} />
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(event)}>
                    <TrashIcon width={14} height={14} />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingEvent ? "Edit event" : "New event"}
        size="lg"
      >
        <EventForm event={editingEvent} onSaved={onSaved} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete event"
        message={`Delete "${deleteTarget?.title}"? All registrations for this event will remain linked to a removed event.`}
        confirmLabel="Delete event"
      />
    </div>
  );
}
