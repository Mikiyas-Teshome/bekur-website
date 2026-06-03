import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { caseStudies } from "@/components/mvp-clone/case-studies/data";
import { StatusPill } from "@/components/mvp-clone/case-studies/CaseStudyMedia";

export const metadata = {
  title: "Work — Shipped systems",
  description: "Production workflows and platforms built by Bekur — outcome-led case studies.",
};

export default function PortfolioPage() {
  const shipped = caseStudies.filter((p) => p.status === "shipped" && p.href);

  return (
    <main className="min-h-screen bg-muted/30 dark:bg-background">
      <div className="relative w-full overflow-hidden px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5 text-primary dark:text-chart-3" strokeWidth={1.75} />
              Shipped systems
            </span>
            <h1 className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]">
              Proof we
              <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                {" "}
                ship.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
              Production systems we&apos;ve built and run — select a project for the full build story.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shipped.map((project) => (
              <Link
                key={project.slug}
                href={project.href!}
                className="group overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_8px_32px_-16px_rgba(33,74,156,0.12)] transition-all hover:border-primary/30 hover:shadow-[0_20px_48px_-20px_rgba(33,74,156,0.22)] dark:bg-card/95 md:rounded-[32px]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <StatusPill status={project.status} label={project.statusLabel} />
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-bold text-foreground">{project.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">{project.stats}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-chart-3">
                    View build story
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
