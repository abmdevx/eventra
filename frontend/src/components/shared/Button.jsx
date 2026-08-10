const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 focus-visible:outline-brand-500 shadow-lg shadow-brand-950/40 disabled:hover:bg-brand-600",
  secondary:
    "bg-surface-3 text-zinc-100 hover:bg-surface-3/70 border border-surface-border focus-visible:outline-zinc-500",
  ghost:
    "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white focus-visible:outline-zinc-500",
  danger:
    "bg-red-950/60 text-brand-300 border border-brand-900 hover:bg-brand-900/40 focus-visible:outline-brand-500",
  outline:
    "bg-transparent border border-brand-700 text-brand-400 hover:bg-brand-950/50 focus-visible:outline-brand-500",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </Tag>
  );
}
