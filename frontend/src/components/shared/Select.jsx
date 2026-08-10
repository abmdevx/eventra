export default function Select({ label, error, className = "", id, children, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      )}
      <select
        id={inputId}
        className={[
          "w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 text-sm text-zinc-100",
          "transition-colors focus:outline-none focus:ring-2",
          error
            ? "border-brand-700 focus:border-brand-600 focus:ring-brand-900/60"
            : "border-surface-border focus:border-brand-700 focus:ring-brand-900/40",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1.5 block text-xs text-brand-400">{error}</span>}
    </label>
  );
}
