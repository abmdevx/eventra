import { useEffect, useState } from "react";
import { usersApi } from "../../lib/endpoints";
import { formatDateTime } from "../../lib/format";
import { Card, EmptyState, Spinner, ShieldIcon } from "../../components/shared";

export default function OwnerActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.getOwnerActivity()
      .then(setActivity)
      .catch((err) => setError(err.message || "Failed to load admin activity"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Admin activity</h1>
        <p className="mt-1 text-sm text-zinc-500">Every event created, updated, or deleted by an administrator.</p>
      </div>
      {loading && <Spinner full />}
      {!loading && error && <EmptyState icon={<ShieldIcon width={22} height={22} />} title="Something went wrong" description={error} />}
      {!loading && !error && activity.length === 0 && <EmptyState icon={<ShieldIcon width={22} height={22} />} title="No admin activity yet" />}
      {!loading && !error && activity.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-zinc-500">
                <tr><th className="px-5 py-3">Admin</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Details</th><th className="px-5 py-3">Time</th></tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {activity.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-3 text-zinc-200">{item.actor?.name || "Unknown"}<div className="text-xs text-zinc-500">{item.actor?.email}</div></td>
                    <td className="px-5 py-3 text-zinc-300">{item.action} {item.resource}</td>
                    <td className="px-5 py-3 text-zinc-400">{item.details}</td>
                    <td className="px-5 py-3 text-zinc-500">{formatDateTime(item.createdAt)}</td>
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
