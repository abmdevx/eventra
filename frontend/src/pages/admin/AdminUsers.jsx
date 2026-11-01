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
  Input,
  Modal,
  Spinner,
  EditIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "../../components/shared";

export default function AdminUsers() {
  const { user: currentUser, can } = useAuth();
  const canRead = can("users", "read");
  const canCreate = can("users", "create");
  const canUpdate = can("users", "update");
  const canDelete = can("users", "delete");
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    if (!canRead) {
      setLoading(false);
      return;
    }
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
  }, [canRead]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "" });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "" });
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, { name: form.name, email: form.email });
        toast.success("User updated");
      } else {
        await usersApi.createManaged(form);
        toast.success("User created");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setFormError(err.message || "Could not save user");
    } finally {
      setSaving(false);
    }
  };

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
        <div className="flex items-center justify-between gap-4">
          <p className="mt-1 text-sm text-zinc-500">Everyone registered on Eventra.</p>
          {canCreate && (
            <Button size="sm" onClick={openCreate}>
              <PlusIcon width={14} height={14} />
              Create user
            </Button>
          )}
        </div>
      </div>

      {loading && <Spinner full />}

      {!loading && error && (
        <EmptyState icon={<UsersIcon width={22} height={22} />} title="Something went wrong" description={error} />
      )}

      {!loading && !error && !canRead && (
        <EmptyState
          icon={<UsersIcon width={22} height={22} />}
          title="User list access is disabled"
          description="You can create users, but viewing the user list requires read permission."
          action={canCreate ? <Button onClick={openCreate}>Create user</Button> : null}
        />
      )}

      {!loading && !error && canRead && users.length === 0 && (
        <EmptyState icon={<UsersIcon width={22} height={22} />} title="No users found" />
      )}

      {!loading && !error && canRead && users.length > 0 && (
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
                  <tr key={u._id} className="transition-colors hover:bg-white/2">
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
                      {canUpdate && (
                        <Button variant="secondary" size="sm" onClick={() => openEdit(u)} className="mr-2">
                          <EditIcon width={13} height={13} />
                          Edit
                        </Button>
                      )}
                      {!canDelete && <span className="text-xs text-zinc-600">View only</span>}
                      {canDelete && (String(u._id) === String(currentUser?._id) ? (
                        <Button variant="danger" size="sm" disabled title="Admins cannot delete their own account">
                          <TrashIcon width={13} height={13} />
                          Delete
                        </Button>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(u)}>
                          <TrashIcon width={13} height={13} />
                          Delete
                        </Button>
                      ))}
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

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingUser ? "Edit user" : "Create user"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" form="user-form" loading={saving}>
              {editingUser ? "Save changes" : "Create user"}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSave} className="flex flex-col gap-4">
          {formError && <p className="text-sm text-brand-400">{formError}</p>}
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={3} maxLength={10} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {!editingUser && (
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          )}
        </form>
      </Modal>
    </div>
  );
}
