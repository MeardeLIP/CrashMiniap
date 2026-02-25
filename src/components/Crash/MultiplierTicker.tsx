import React from "react";
import type { RoundPhase } from "../../hooks/useCrashGame";

interface MultiplierTickerProps {
  multiplier: number;
  phase: RoundPhase;
  countdownSeconds?: number;
}

function getMultiplierColor(multiplier: number, isCrashed: boolean): { color: string; shadow: string } {
  if (isCrashed) return { color: "#f97373", shadow: "0 0 26px rgba(248, 113, 113, 0.7)" };
  if (multiplier >= 20) return { color: "#fef08a", shadow: "0 0 28px rgba(254, 240, 138, 0.7)" };
  if (multiplier >= 10) return { color: "#fcd34d", shadow: "0 0 26px rgba(252, 211, 77, 0.65)" };
  if (multiplier >= 5) return { color: "#fbbf24", shadow: "0 0 24px rgba(251, 191, 36, 0.6)" };
  if (multiplier >= 2) return { color: "#86efac", shadow: "0 0 22px rgba(134, 239, 172, 0.55)" };
  if (multiplier >= 1.5) return { color: "#bbf7d0", shadow: "0 0 20px rgba(187, 247, 208, 0.5)" };
  return { color: "#ffffff", shadow: "0 0 20px rgba(255, 255, 255, 0.45)" };
}

export const MultiplierTicker: React.FC<MultiplierTickerProps> = ({
  multiplier,
  phase,
  countdownSeconds
}) => {
  const isWaiting = phase === "waiting";
  const showCountdown = isWaiting && typeof countdownSeconds === "number" && countdownSeconds > 0;
  const baseValue = showCountdown ? countdownSeconds.toString() : multiplier.toFixed(2);
  const suffix = phase === "running" || phase === "crashed" ? "x" : "";
  const formatted = `${baseValue}${suffix}`;
  const isCrashed = phase === "crashed";
  const { color, shadow } = showCountdown
    ? { color: "#ffffff", shadow: "0 0 18px rgba(255, 255, 255, 0.4)" }
    : getMultiplierColor(multiplier, isCrashed);

  return (
    <div className="multiplier-wrapper">
      <div className="multiplier-value" style={{ color, textShadow: shadow }}>
        {formatted}
      </div>
    </div>
  );
};

