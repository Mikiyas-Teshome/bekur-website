import { cn } from "@/lib/utils";
import type { MockStatus } from "@/components/marketing/motion/useStatusSequence";

const config: Record<MockStatus, { label: string; className: string; dot: string }> = {
  queued: {
    label: "Queued",
    className: "border-mk-border text-mk-text-3",
    dot: "bg-mk-text-3",
  },
  running: {
    label: "Running",
    className: "border-mk-accent-a25 bg-mk-accent-a10 text-mk-accent",
    dot: "bg-mk-accent animate-pulse motion-reduce:animate-none",
  },
  done: {
    label: "Done",
    className: "border-[rgba(61,214,140,0.25)] bg-[rgba(61,214,140,0.08)] text-mk-positive",
    dot: "bg-mk-positive",
  },
};

export default function StatusPill({
  status,
  className,
}: {
  status: MockStatus;
  className?: string;
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono-mk text-[10px] uppercase tracking-[0.12em] transition-colors duration-300",
        c.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
