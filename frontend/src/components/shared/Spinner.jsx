export default function Spinner({ className = "h-5 w-5", full = false }) {
  const spinner = (
    <span
      className={[
        "inline-block animate-spin rounded-full border-2 border-zinc-700 border-t-brand-500",
        className,
      ].join(" ")}
    />
  );

  if (!full) return spinner;

  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">{spinner}</div>
  );
}
