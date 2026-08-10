export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 text-brand-500">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-zinc-200">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
