import { useEffect, useState } from "react";
import { usersApi } from "../../lib/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../lib/format";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Spinner,
  TrashIcon,
  UsersIcon,
} from "../../components/shared";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usersApi.remove(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-zinc-500">Everyone registered on Eventra.</p>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState icon={<UsersIcon width={22} height={22} />} title="Something went wrong" description={error} />
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState icon={<UsersIcon width={22} height={22} />} title="No users found" />
      )}

      {!loading && !error && users.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-zinc-200">
                      {u.name}
                      {String(u._id) === String(currentUser?._id) && (
                        <Badge tone="success" className="ml-2">
                          Your account
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                    <td className="px-5 py-3">
                      <Badge tone={u.role === "admin" ? "brand" : "neutral"}>{u.role}</Badge>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {String(u._id) === String(currentUser?._id) ? (
                        <Button variant="danger" size="sm" disabled title="Admins cannot delete their own account">
                          <TrashIcon width={13} height={13} />
                          Delete
                        </Button>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(u)}>
                          <TrashIcon width={13} height={13} />
                          Delete
                        </Button>
                      )}
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
        title="Delete user"
        message={`Delete ${deleteTarget?.name}'s account? Their registrations will also be removed.`}
        confirmLabel="Delete user"
      />
    </div>
  );
}
