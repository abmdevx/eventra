import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button, Input, Alert, Card, LockIcon } from "../../components/shared";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(location.state?.from?.pathname || "/events", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
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
          <h1 className="font-display text-xl font-bold text-zinc-100">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Log in to manage your event registrations.</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Alert tone="error">{error}</Alert>
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
            minLength={8}
          />
          <Button type="submit" loading={loading} className="mt-1 w-full">
            <LockIcon width={16} height={16} />
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
