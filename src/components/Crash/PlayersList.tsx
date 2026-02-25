import React from "react";
import type { RoundPhase } from "../../hooks/useCrashGame";
import type { PlayerBetState } from "../../hooks/useCrashGame";
import { useTelegramUser } from "../../hooks/useTelegramUser";

interface PlayersListProps {
  phase: RoundPhase;
  currentMultiplier: number;
  bet: PlayerBetState;
}

const TON_ICON = "/yellowton.png";

export const PlayersList: React.FC<PlayersListProps> = ({
  phase,
  currentMultiplier,
  bet
}) => {
  const tgUser = useTelegramUser();
  const hasAnyBet = bet.hasBet;
  const displayName = tgUser?.first_name ?? tgUser?.username ?? "Моя ставка";
  const avatarUrl = tgUser?.photo_url;
  const finishedMultiplier =
    phase === "crashed" || bet.cashedOut
      ? bet.cashoutMultiplier ?? currentMultiplier
      : currentMultiplier;
  const won = bet.cashedOut && (bet.winAmount ?? 0) > 0;
  const lost = phase === "crashed" && !bet.cashedOut && bet.hasBet;
  const payoutClassName =
    "player-payout-amount " +
    (won ? "player-payout-amount--win" : "player-payout-amount--loss");
  const payout = bet.hasBet
    ? bet.cashedOut
      ? bet.winAmount
      : lost
        ? 0
        : bet.betAmount * finishedMultiplier
    : null;

  return (
    <div className={"players-list" + (!hasAnyBet ? " players-list--empty" : "")}>
      {!hasAnyBet ? (
        <div className="players-list-empty">Ожидание ставок</div>
      ) : (
        <div className="player-row">
          <div className="player-main">
            <div className="player-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="player-avatar-img" />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="player-meta">
              <span className="player-name">{displayName}</span>
              <span className="player-sub">
                <img src={TON_ICON} alt="" className="player-ton-icon" />
                {bet.betAmount.toFixed(2)}
                <span className="player-sub-mul"> ×{finishedMultiplier.toFixed(2)}</span>
              </span>
            </div>
          </div>
          <div className="player-payout">
            <div className={payoutClassName}>
              <img src={TON_ICON} alt="" className="player-ton-icon player-ton-icon--payout" />
              {payout != null ? payout.toFixed(2) : "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
