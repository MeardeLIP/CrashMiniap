import React from "react";
import { useCrashGame } from "../../hooks/useCrashGame";
import { useDraggable } from "../../hooks/useDraggable";
import { RocketBunny } from "./RocketBunny";
import { MultiplierTicker } from "./MultiplierTicker";
import { BetPanel } from "./BetPanel";
import { PlayersList } from "./PlayersList";

export const CrashScreen: React.FC = () => {
  const { round, bet, history, placeBet, cashout, setBetAmount, rocketHeightProgress } =
    useCrashGame();
  const settingsDrag = useDraggable({ id: "crash-settings", requireAlt: false });
  const videoMenuDrag = useDraggable({
    id: "crash-video-menu",
    requireAlt: false,
    bounds: { minX: -280, maxX: 280, minY: -220, maxY: 180 }
  });
  const multiplierDrag = useDraggable({ id: "crash-multiplier", requireAlt: false });
  const rocketDrag = useDraggable({ id: "crash-rocket", requireAlt: false });

  return (
    <main className="crash-screen">
        <div className="crash-space">
          <div className="space-stars" />
          <div className="crash-draggable-layer">
            <div className="crash-multiplier-anchor">
              <div className="crash-draggable-inner" style={multiplierDrag.style}>
                <MultiplierTicker
                  multiplier={round.multiplier}
                  phase={round.phase}
                  countdownSeconds={round.countdownSeconds}
                />
              </div>
            </div>
            {round.phase !== "waiting" && (
              <div className="crash-rocket-anchor">
                <div
                  className="crash-draggable-inner crash-draggable-inner--rocket"
                  style={rocketDrag.style}
                >
                  <RocketBunny
                    flying={round.phase === "running"}
                    crashed={round.phase === "crashed"}
                    heightProgress={rocketHeightProgress}
                  />
                </div>
              </div>
            )}
          </div>
        <div className="crash-video-menu">
          <div
            className="crash-video-menu__draggable"
            style={videoMenuDrag.style}
          >
            <div className="recent-multipliers-row">
              <div className="recent-multiplier-pill recent-multiplier-pill--primary">
                {round.phase === "waiting" ? "Ожидание" : `x${round.multiplier.toFixed(2)}`}
              </div>
              {history.map((value, index) => (
                <div className="recent-multiplier-pill" key={index}>
                  {value.toFixed(2)}
                </div>
              ))}
            </div>
            <BetPanel
              phase={round.phase}
              bet={bet}
              countdownSeconds={round.countdownSeconds}
              onChangeAmount={setBetAmount}
              onPlaceBet={placeBet}
              onCashout={cashout}
            />
          </div>
        </div>
        <button
          type="button"
          className="crash-settings-button"
          aria-label="Настройки краша"
          style={settingsDrag.style}
        >
          ⚙
        </button>
      </div>
      <div className="crash-bottom-panel">
        <PlayersList
          phase={round.phase}
          currentMultiplier={round.multiplier}
          bet={bet}
        />
      </div>
    </main>
  );
};

