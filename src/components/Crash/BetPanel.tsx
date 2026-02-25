import React from "react";
import type { PlayerBetState, RoundPhase } from "../../hooks/useCrashGame";

export interface BetPanelProps {
  phase: RoundPhase;
  bet: PlayerBetState;
  countdownSeconds?: number;
  onChangeAmount(amount: number): void;
  onPlaceBet(): void;
  onCashout(): void;
}

export const BetPanel: React.FC<BetPanelProps> = ({
  phase,
  bet,
  countdownSeconds = 5,
  onPlaceBet,
  onCashout
}) => {
  const handleClick = () => {
    if (phase === "waiting") {
      // Отправляем событие в Telegram WebApp (если открыто внутри ТГ)
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.sendData(
            JSON.stringify({
              action: "bet",
              amount: bet.betAmount
            })
          );
        }
      } catch {
        // игнорируем, если Telegram недоступен
      }
      onPlaceBet();
    } else if (phase === "running" && bet.hasBet && !bet.cashedOut) {
      onCashout();
    }
  };

  const countdownEnded = phase === "waiting" && countdownSeconds === 0;

  const isCashoutPhase = phase === "running" && bet.hasBet && !bet.cashedOut;

  const mainButtonLabel =
    phase === "waiting"
      ? bet.hasBet
        ? "Ожидание"
        : "Сделать ставку"
      : phase === "running" && isCashoutPhase
      ? "Забрать"
      : "Ожидание";

  const isWaitingLabel = mainButtonLabel === "Ожидание";
  const disabled =
    countdownEnded ||
    (phase === "waiting" && (bet.betAmount <= 0 || bet.hasBet)) ||
    (phase === "running" && !isCashoutPhase) ||
    phase === "crashed";

  const buttonClass =
    "bet-main-button" +
    (isCashoutPhase ? " bet-main-button--secondary" : "") +
    (isWaitingLabel ? " bet-main-button--waiting" : "");

  return (
    <section className="bet-panel">
      <button
        type="button"
        className={buttonClass}
        onClick={handleClick}
        disabled={disabled}
      >
        {mainButtonLabel}
      </button>
    </section>
  );
};

