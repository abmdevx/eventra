import { useEffect, useState } from "react";
import { registrationsApi } from "../../lib/endpoints";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../lib/format";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Spinner,
  TicketIcon,
  TrashIcon,
} from "../../components/shared";

const STATUSES = ["confirmed", "cancelled"];

export default function AdminRegistrations() {
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await registrationsApi.getAll();
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

  const handleStatusChange = async (reg, status) => {
    if (status === reg.status) return;
    setUpdatingId(reg._id);
    try {
      await registrationsApi.update(reg._id, { status });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await registrationsApi.remove(deleteTarget._id);
      toast.success("Registration deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not delete registration");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
          All registrations
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Review and manage every registration across events.</p>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState icon={<TicketIcon width={22} height={22} />} title="Something went wrong" description={error} />
      )}

      {!loading && !error && registrations.length === 0 && (
        <EmptyState icon={<TicketIcon width={22} height={22} />} title="No registrations yet" />
      )}

      {!loading && !error && registrations.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Registered</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="font-medium text-zinc-200">{reg.user?.name || "—"}</div>
                      <div className="text-xs text-zinc-500">{reg.user?.email}</div>
                    </td>
                    <td className="px-5 py-3 text-zinc-300">{reg.event?.title || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500">{formatDate(reg.createdAt)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={reg.status}
                        disabled={updatingId === reg._id}
                        onChange={(e) => handleStatusChange(reg, e.target.value)}
                        className="rounded-lg border border-surface-border bg-surface-2 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-900/40 disabled:opacity-50"
                      >
                        {[...new Set([reg.status, ...STATUSES])].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(reg)}>
                        <TrashIcon width={13} height={13} />
                        Delete
                      </Button>
                    </td>
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
        message="This will permanently remove this registration record."
        confirmLabel="Delete registration"
      />
    </div>
  );
}
