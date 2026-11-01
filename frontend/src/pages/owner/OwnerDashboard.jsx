import { useEffect, useState } from "react";
import { usersApi } from "../../lib/endpoints";
import { useToast } from "../../context/ToastContext";
import { Badge, Button, Card, EmptyState, Spinner, UsersIcon } from "../../components/shared";

const resources = ["events", "users", "registrations"];
const actions = ["read", "create", "update", "delete"];

function permissionsFor(user) {
  return resources.reduce((result, resource) => {
    result[resource] = actions.reduce((values, action) => {
      values[action] = user.permissions?.[resource]?.[action] === true;
      return values;
    }, {});
    return result;
  }, {});
}

export default function OwnerDashboard() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data || []);
      setDrafts(Object.fromEntries((data || []).map((user) => [user._id, {
        role: user.role === "admin" ? "admin" : "user",
        permissions: permissionsFor(user),
      }])));
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateDraft = (userId, update) => {
    setDrafts((current) => ({ ...current, [userId]: { ...current[userId], ...update } }));
  };

  const togglePermission = (userId, resource, action) => {
    const current = drafts[userId];
    updateDraft(userId, {
      permissions: {
        ...current.permissions,
        [resource]: {
          ...current.permissions[resource],
          [action]: !current.permissions[resource][action],
        },
      },
    });
  };

  const save = async (user) => {
    const draft = drafts[user._id];
    setSaving(user._id);
    try {
      await usersApi.updateAccess(user._id, draft);
      toast.success(`${user.name}'s access was updated`);
      await load();
    } catch (err) {
      toast.error(err.message || "Could not update access");
    } finally {
      setSaving("");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Owner dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Choose administrators and grant each one only the access they need.</p>
      </div>
      {loading && <Spinner full />}
      {!loading && error && <EmptyState icon={<UsersIcon width={22} height={22} />} title="Something went wrong" description={error} />}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {users.map((user) => {
            const draft = drafts[user._id];
            const locked = user.role === "owner";
            return (
              <Card key={user._id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-zinc-100">{user.name}</h2>
                      <Badge tone={user.role === "owner" ? "success" : user.role === "admin" ? "brand" : "neutral"}>{user.role}</Badge>
                    </div>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                  </div>
                  {!locked && (
                    <div className="flex items-center gap-3">
                      <select
                        value={draft.role}
                        onChange={(event) => updateDraft(user._id, { role: event.target.value })}
                        className="rounded-lg border border-surface-border bg-surface-2 px-3 py-2 text-sm text-zinc-200"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button size="sm" onClick={() => save(user)} disabled={saving === user._id}>
                        {saving === user._id ? "Saving..." : "Save access"}
                      </Button>
                    </div>
                  )}
                </div>
                {!locked && draft.role === "admin" && (
                  <div className="mt-5 grid gap-3 border-t border-surface-border pt-4 md:grid-cols-3">
                    {resources.map((resource) => (
                      <div key={resource}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{resource}</p>
                        <div className="flex flex-wrap gap-3">
                          {actions.map((action) => (
                            <label key={action} className="flex items-center gap-1.5 text-sm text-zinc-300">
                              <input
                                type="checkbox"
                                checked={draft.permissions[resource][action]}
                                onChange={() => togglePermission(user._id, resource, action)}
                              />
                              {action}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
