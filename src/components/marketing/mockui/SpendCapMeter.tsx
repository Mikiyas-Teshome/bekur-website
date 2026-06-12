import ProgressBar from "./ProgressBar";

type SpendCapMeterProps = {
  spent?: number;
  cap?: number;
};

/** The "Controlled AI" signature mock: monthly AI spend against a hard cap. */
export default function SpendCapMeter({ spent = 240, cap = 300 }: SpendCapMeterProps) {
  const pct = (spent / cap) * 100;

  return (
    <div aria-hidden className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono-mk text-[10px] uppercase tracking-[0.16em] text-mk-text-3">
          AI spend · this month
        </span>
        <span className="font-mono-mk text-xs text-mk-text-1">
          ${spent}
          <span className="text-mk-text-3"> / ${cap} cap</span>
        </span>
      </div>
      <ProgressBar value={pct} color={pct > 85 ? "warn" : "accent"} />
      <div className="flex items-center justify-between font-mono-mk text-[10px] uppercase tracking-[0.12em]">
        <span className="text-mk-positive">Within cap</span>
        <span className="text-mk-text-3">Hard stop at ${cap}</span>
      </div>
    </div>
  );
}
