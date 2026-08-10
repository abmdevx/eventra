import { useEffect, useState } from "react";
import { eventsApi } from "../../lib/endpoints";
import { toDateTimeLocalInput } from "../../lib/format";
import { Button, Input, Textarea, Alert, SparklesIcon } from "../../components/shared";

const emptyForm = { title: "", description: "", date: "", location: "", capacity: 20 };

export default function EventForm({ event, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        date: toDateTimeLocalInput(event.date),
        location: event.location || "",
        capacity: event.capacity ?? 20,
      });
    } else {
      setForm(emptyForm);
    }
  }, [event]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "capacity" ? Number(value) : value }));
  };

  const handleGenerateDescription = async () => {
    if (!event?._id) {
      setError("Save the event once before generating an AI description.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const updated = await eventsApi.generateDescription(event._id);
      setForm((f) => ({ ...f, description: updated.description }));
    } catch (err) {
      setError(err.message || "Could not generate description");
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    if (form.description.trim().length < 20) {
      setError("Description must be at least 20 characters.");
      return;
    }
    if (!form.date || new Date(form.date) <= new Date()) {
      setError("Date must be in the future.");
      return;
    }
    if (form.location.trim().length < 3) {
      setError("Location is required.");
      return;
    }
    if (!form.capacity || form.capacity < 1) {
      setError("Capacity must be greater than 0.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: new Date(form.date).toISOString(),
        location: form.location.trim(),
        capacity: form.capacity,
      };
      if (event) {
        await eventsApi.update(event._id, payload);
      } else {
        await eventsApi.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Could not save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Alert tone="error">{error}</Alert>
      <Input label="Title" name="title" value={form.title} onChange={onChange} required />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Description</span>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={generating}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 disabled:opacity-50"
          >
            <SparklesIcon width={13} height={13} className={generating ? "animate-pulse" : ""} />
            {generating ? "Generating…" : "Generate with AI"}
          </button>
        </div>
        <Textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={onChange}
          required
        />
      </div>

      <Input
        label="Date & time"
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={onChange}
        required
      />
      <Input label="Location" name="location" value={form.location} onChange={onChange} required />
      <Input
        label="Capacity"
        type="number"
        name="capacity"
        min={1}
        value={form.capacity}
        onChange={onChange}
        required
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {event ? "Save changes" : "Create event"}
        </Button>
      </div>
    </form>
  );
}
