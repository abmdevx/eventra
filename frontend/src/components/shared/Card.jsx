export default function Card({ className = "", children, hover = false, ...props }) {
  return (
    <div
      className={[
        "rounded-2xl border border-surface-border bg-surface-1/80 backdrop-blur-sm",
        hover && "transition-all duration-200 hover:border-brand-800/60 hover:shadow-lg hover:shadow-brand-950/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
