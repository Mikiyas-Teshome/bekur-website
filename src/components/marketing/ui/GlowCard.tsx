import { cn } from "@/lib/utils";

type GlowCardProps = {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "li";
};

export default function GlowCard({ className, children, as: Tag = "div" }: GlowCardProps) {
  return (
    <Tag
      className={cn(
        "group relative rounded-2xl border border-mk-border bg-mk-surface-1 transition-colors duration-300 hover:border-mk-border-strong",
        className,
      )}
    >
      {/* accent glow on hover, kept subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at 50% 0%, var(--mk-accent-a10), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
