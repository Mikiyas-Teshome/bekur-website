import BookCallLink from "@/components/BookCallLink";
import { loadPageContent } from "@/lib/content/load-page";

function FourPointStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C12.8 7.1 16.9 11.2 24 12C16.9 12.8 12.8 16.9 12 24C11.2 16.9 7.1 12.8 0 12C7.1 11.2 11.2 7.1 12 0Z" />
    </svg>
  );
}

function LineWithSparkle({ text }: { text: string }) {
  const words = text.split(" ");
  if (words.length < 2) {
    return <>{text}</>;
  }
  const mid = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, mid).join(" ")}
      <FourPointStar className="mx-2.5 inline-block h-[0.5em] w-[0.5em] -translate-y-[0.04em] md:mx-4" />
      {words.slice(mid).join(" ")}
    </>
  );
}

export default function Hero() {
  const home = loadPageContent("home");
  if (home.pageId !== "home") {
    throw new Error("Expected home page content");
  }

  const { hero } = home;
  const headlineLines = hero.headlineLines?.length
    ? hero.headlineLines
    : [{ text: hero.headline, accent: false, sparkle: false }];

  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#e9edf5] via-[#eef2f8] to-[#f2f5fa] dark:bg-none dark:bg-[#000104]"
        aria-hidden="true"
      >
        <div className="hero-dots absolute inset-0" />
        <div className="hero-glow absolute inset-0" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center pt-[5.5rem] pb-16 md:pt-[6rem] md:pb-20">
        <h1 className="mb-6 text-balance font-bold leading-[1.07] tracking-tight text-[clamp(40px,8.5vw,88px)] md:mb-7">
          {headlineLines.map((line) => (
            <span
              key={line.text}
              className={line.accent ? "hero-accent block" : "block text-foreground"}
            >
              {line.sparkle ? <LineWithSparkle text={line.text} /> : line.text}
            </span>
          ))}
        </h1>

        <p className="mb-10 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:mb-12 md:text-[17px]">
          {hero.subheadline}
        </p>

        <BookCallLink
          href={hero.primaryCta.href}
          label={hero.primaryCta.label}
          variant="primary"
          showArrow
        />
      </div>
    </section>
  );
}
