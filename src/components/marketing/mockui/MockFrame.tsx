import { cn } from "@/lib/utils";

type MockFrameProps = {
  title: string;
  live?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Product-UI window chrome: traffic dots, mono title bar, surface-2 body. */
export default function MockFrame({ title, live = false, className, children }: MockFrameProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-xl border border-mk-border bg-mk-surface-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-mk-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono-mk text-[10px] uppercase tracking-[0.16em] text-mk-text-3">
          {title}
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 font-mono-mk text-[10px] uppercase tracking-[0.16em] text-mk-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mk-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mk-accent" />
            </span>
            Live
          </span>
        ) : (
          <span className="w-8" />
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
