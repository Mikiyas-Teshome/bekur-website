import { cn } from "@/lib/utils";

type SectionKickerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionKicker({ children, className }: SectionKickerProps) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-2 font-mono-mk text-[11px] font-medium uppercase tracking-[0.16em] text-mk-text-3",
        className,
      )}
    >
      <span aria-hidden className="h-px w-5 bg-mk-accent" />
      {children}
    </p>
  );
}
