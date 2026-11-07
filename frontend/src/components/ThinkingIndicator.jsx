import { useEffect, useState } from "react";

// Status lines in each persona's voice. They set the mood while the reply is
// on its way; they do not report real steps. The last line holds until the
// reply starts.
const statusLines = {
  professional: ["Thinking", "Checking the numbers", "Weighing your options", "Writing your answer"],
  savage: ["Judging your choices", "Sharpening the roast", "Finding the painful part", "Holding nothing back"],
  genz: ["Locking in", "Cooking", "Asking the sigma council", "No cap, almost there"],
};

// Neurons of the logo in its 512 unit grid, with the moment each one fires.
const neurons = [
  { x: 29, y: 179, at: 100 },
  { x: 90, y: 234, at: 100 },
  { x: 376, y: 350, at: 140 },
  { x: 120, y: 137, at: 360 },
  { x: 453, y: 324, at: 360 },
  { x: 197, y: 202, at: 400 },
  { x: 196, y: 304, at: 530 },
  { x: 138, y: 65, at: 570 },
  { x: 200, y: 111, at: 650 },
  { x: 257, y: 36, at: 770 },
  { x: 316, y: 93, at: 940 },
];

const ThinkingMark = () => (
  <svg viewBox="0 0 512 512" className="think-mark" aria-hidden="true">
    <defs>
      <mask id="think-logo" style={{ maskType: "alpha" }}>
        <image href="/logo-mark.png" width="512" height="512" />
      </mask>
      <radialGradient id="think-glow">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#c9f7e4" />
        <stop offset="100%" stopColor="#c9f7e4" stopOpacity="0" />
      </radialGradient>
    </defs>

    <image href="/logo-mark.png" width="512" height="512" className="think-base" />

    {/* Masked to the logo, so the light can only travel along its real lines. */}
    <g mask="url(#think-logo)">
      <circle r="58" fill="url(#think-glow)" className="think-signal think-route-top" />
      <circle r="58" fill="url(#think-glow)" className="think-signal think-route-crown" />
      <circle r="58" fill="url(#think-glow)" className="think-signal think-route-low" />
      <circle r="58" fill="url(#think-glow)" className="think-signal think-route-right" />
      <circle cx="300" cy="205" r="100" fill="none" stroke="#e4fbf1" strokeWidth="34" className="think-wave" />
    </g>

    {neurons.map(({ x, y, at }) => (
      <circle
        key={`${x}-${y}`}
        cx={x}
        cy={y}
        r="15"
        fill="#e4fbf1"
        className="think-neuron"
        style={{ animationDelay: `${at}ms` }}
      />
    ))}
  </svg>
);

const ThinkingIndicator = ({ persona = "professional" }) => {
  const lines = statusLines[persona] || statusLines.professional;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => Math.min(current + 1, lines.length - 1));
    }, 2200);
    return () => clearInterval(timer);
  }, [lines.length]);

  return (
    <div role="status" aria-label="Thinking" className="flex items-center gap-3">
      <ThinkingMark />
      <span key={lines[step]} aria-hidden="true" className="thinking-text text-sm leading-6">
        {lines[step]}
      </span>
    </div>
  );
};

export default ThinkingIndicator;
