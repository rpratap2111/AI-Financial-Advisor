const today = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// A sheet of passbook paper. This is the one bright surface in the app, so it
// is reserved for predictions and never used as a general card.
export const PassbookPage = ({ className = "", children }) => (
  <div className={`relative ${className}`}>
    <div
      aria-hidden="true"
      className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg bg-paper-edge"
    />
    <div className="relative overflow-hidden rounded-lg bg-paper text-paper-ink shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-8 w-px bg-paper-margin sm:left-10"
      />
      {children}
    </div>
  </div>
);

export const PassbookRow = ({ label, value }) => (
  <div className="flex min-h-11 items-center justify-between gap-4 border-b border-paper-rule py-2 pr-4 pl-12 text-sm sm:pr-6 sm:pl-14">
    <span className="text-paper-ink-2">{label}</span>
    <span className="text-right font-mono tabular-nums">{value}</span>
  </div>
);

// The teller's stamp. It marks a verdict and appears nowhere else.
export const Stamp = ({ tone = "good", className = "", children }) => (
  <div
    className={`inline-flex shrink-0 -rotate-6 flex-col items-center gap-0.5 rounded-md border-[3px] border-double px-3 py-2 font-mono opacity-90 mix-blend-multiply ${
      tone === "good"
        ? "border-stamp-good text-stamp-good"
        : "border-stamp-bad text-stamp-bad"
    } ${className}`}
  >
    <span className="text-sm leading-4 font-medium whitespace-nowrap">{children}</span>
    <span className="text-[11px] leading-4 whitespace-nowrap tabular-nums">{today()}</span>
  </div>
);
