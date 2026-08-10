const TONES = {
  neutral: "bg-surface-3 text-zinc-300 border-surface-border",
  brand: "bg-brand-950/60 text-brand-300 border-brand-900",
  success: "bg-emerald-950/60 text-emerald-300 border-emerald-900",
  warning: "bg-amber-950/60 text-amber-300 border-amber-900",
  danger: "bg-red-950/60 text-red-300 border-red-900",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        TONES[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
