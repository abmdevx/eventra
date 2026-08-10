const TONES = {
  error: "border-brand-900 bg-brand-950/40 text-brand-300",
  info: "border-surface-border bg-surface-2 text-zinc-300",
  success: "border-emerald-900 bg-emerald-950/40 text-emerald-300",
};

export default function Alert({ tone = "info", children, className = "" }) {
  if (!children) return null;
  return (
    <div className={["rounded-lg border px-3.5 py-2.5 text-sm", TONES[tone], className].join(" ")}>
      {children}
    </div>
  );
}
