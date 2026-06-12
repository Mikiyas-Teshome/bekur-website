import { cn } from "@/lib/utils";
import StatusPill from "./StatusPill";
import type { MockStatus } from "@/components/marketing/motion/useStatusSequence";

type MockRowProps = {
  label: string;
  sublabel?: string;
  status: MockStatus;
  className?: string;
};

/** Generic queue-row for intake-style mockups. */
export default function MockRow({ label, sublabel, status, className }: MockRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-mk-border bg-mk-surface-3/60 px-3 py-2.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "h-6 w-6 shrink-0 rounded-full border border-mk-border",
            status === "done" ? "bg-mk-accent-a10" : "bg-mk-surface-2",
          )}
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-mk-text-1">{label}</p>
          {sublabel && (
            <p className="truncate font-mono-mk text-[10px] text-mk-text-3">{sublabel}</p>
          )}
        </div>
      </div>
      <StatusPill status={status} />
    </div>
  );
}
