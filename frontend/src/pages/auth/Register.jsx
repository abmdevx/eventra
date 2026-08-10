import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button, Input, Alert, Card } from "../../components/shared";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 3 || form.name.trim().length > 10) {
      setError("Name must be between 3 and 10 characters.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm p-7">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg font-bold text-white shadow-lg shadow-brand-950/50">
            E
          </span>
          <h1 className="font-display text-xl font-bold text-zinc-100">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">Join Eventra to start registering for events.</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Alert tone="error">{error}</Alert>
          <Input
            label="Name"
            name="name"
            placeholder="3–10 characters"
            value={form.name}
            onChange={onChange}
            maxLength={10}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={onChange}
            minLength={8}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirm"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={onChange}
            minLength={8}
            required
          />
          <Button type="submit" loading={loading} className="mt-1 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
