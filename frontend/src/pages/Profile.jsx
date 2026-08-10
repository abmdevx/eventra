import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button, Input, Card, Badge, Alert, ConfirmDialog } from "../components/shared";

export default function Profile() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
      toast.success("Profile updated");
    } catch (err) {
      setProfileError(err.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      toast.success("Password changed");
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPwError(err.message || "Could not change password");
    } finally {
      setPwLoading(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Could not delete account");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Your profile
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-zinc-500">Manage your account details.</p>
            <Badge tone={user?.role === "admin" ? "brand" : "neutral"}>{user?.role}</Badge>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-base font-semibold text-zinc-100">Account details</h2>
        <form onSubmit={onProfileSubmit} className="mt-4 flex flex-col gap-4">
          <Alert tone="error">{profileError}</Alert>
          <Input
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
            maxLength={10}
            required
          />
          <Input
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Button type="submit" loading={profileLoading} className="self-start">
            Save changes
          </Button>
        </form>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-display text-base font-semibold text-zinc-100">Change password</h2>
        <form onSubmit={onPasswordSubmit} className="mt-4 flex flex-col gap-4">
          <Alert tone="error">{pwError}</Alert>
          <Input
            label="Current password"
            type="password"
            value={pwForm.oldPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, oldPassword: e.target.value }))}
            minLength={8}
            required
          />
          <Input
            label="New password"
            type="password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
            minLength={8}
            required
          />
          <Button type="submit" variant="secondary" loading={pwLoading} className="self-start">
            Update password
          </Button>
        </form>
      </Card>

      <Card className="mt-6 border-brand-900/60 p-6">
        <h2 className="font-display text-base font-semibold text-brand-300">Danger zone</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Deleting your account also removes your event registrations. This can't be undone.
        </p>
        <Button variant="danger" className="mt-4" onClick={() => setConfirmDelete(true)}>
          Delete my account
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={onDelete}
        loading={deleting}
        title="Delete account"
        message="This will permanently delete your account and all of your registrations."
        confirmLabel="Delete account"
      />
    </div>
  );
}
