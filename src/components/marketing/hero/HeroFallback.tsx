/**
 * Static stand-in for the WebGL hero scene: same workflow-network silhouette,
 * rendered as SVG + CSS glow. Used while the scene chunk loads, under
 * prefers-reduced-motion, and when WebGL is unavailable.
 */
export default function HeroFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, var(--mk-accent-a10), transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 1200 600"
        className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="rgba(74,158,255,0.12)" strokeWidth="1">
          <path d="M 220 180 L 600 300" />
          <path d="M 180 300 L 600 300" />
          <path d="M 230 430 L 600 300" />
          <path d="M 320 240 L 600 300" />
          <path d="M 300 370 L 600 300" />
          <path d="M 600 300 L 900 190" />
          <path d="M 600 300 L 980 300" />
          <path d="M 600 300 L 920 420" />
          <path d="M 600 300 L 850 250" />
        </g>
        <g fill="rgba(242,242,245,0.35)">
          <circle cx="220" cy="180" r="3" />
          <circle cx="180" cy="300" r="2.5" />
          <circle cx="230" cy="430" r="3" />
          <circle cx="320" cy="240" r="2" />
          <circle cx="300" cy="370" r="2.5" />
          <circle cx="900" cy="190" r="3" />
          <circle cx="980" cy="300" r="2.5" />
          <circle cx="920" cy="420" r="3" />
          <circle cx="850" cy="250" r="2" />
        </g>
        <circle cx="600" cy="300" r="6" fill="var(--mk-accent)" opacity="0.9" />
        <circle cx="600" cy="300" r="18" stroke="var(--mk-accent)" strokeOpacity="0.25" />
      </svg>
    </div>
  );
}
