import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export default function SectionShell({
  id,
  className,
  innerClassName,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-16 md:py-24 lg:py-32", className)}
    >
      <div className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
