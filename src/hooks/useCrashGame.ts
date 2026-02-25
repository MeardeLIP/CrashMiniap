import { useCallback, useEffect, useRef, useState } from "react";

export type RoundPhase = "waiting" | "running" | "crashed";

export interface CrashRoundState {
  phase: RoundPhase;
  multiplier: number;
  maxMultiplier: number;
  countdownSeconds: number;
}

export interface PlayerBetState {
  betAmount: number;
  hasBet: boolean;
  cashedOut: boolean;
  cashoutMultiplier: number | null;
  winAmount: number | null;
}

export interface UseCrashGameOptions {
  tickIntervalMs?: number;
}

const MIN_MAX_MULTIPLIER = 1.2;
const MAX_MAX_MULTIPLIER = 40;

export function useCrashGame(options?: UseCrashGameOptions) {
  const tickIntervalMs = options?.tickIntervalMs ?? 50;

  const [round, setRound] = useState<CrashRoundState>(() => ({
    phase: "waiting",
    multiplier: 1,
    maxMultiplier: generateMaxMultiplier(),
    countdownSeconds: 5
  }));

  const [bet, setBet] = useState<PlayerBetState>({
    betAmount: 10,
    hasBet: false,
    cashedOut: false,
    cashoutMultiplier: null,
    winAmount: null
  });

  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCountdown = () => {
    if (countdownRef.current !== null) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  /** Подтвердить ставку на следующий раунд (до конца отсчёта). Раунд стартует сам по таймеру. */
  const placeBet = useCallback(() => {
    setBet((prev) =>
      prev.betAmount > 0 ? { ...prev, hasBet: true } : prev
    );
  }, []);

  const startRound = useCallback(() => {
    clearTimer();
    clearCountdown();
    setRound({
      phase: "running",
      multiplier: 1,
      maxMultiplier: generateMaxMultiplier(),
      countdownSeconds: 0
    });
    setBet((prev) => ({
      ...prev,
      cashedOut: false,
      cashoutMultiplier: null,
      winAmount: null,
      hasBet: prev.betAmount > 0
    }));
  }, []);

  const crashNow = useCallback(() => {
    clearTimer();
    setRound((prev) => ({ ...prev, phase: "crashed" }));
  }, []);

  const cashout = useCallback(() => {
    setBet((prev) => {
      if (!prev.hasBet || prev.cashedOut) return prev;
      const winAmount = Number((prev.betAmount * round.multiplier).toFixed(2));
      return {
        ...prev,
        cashedOut: true,
        cashoutMultiplier: round.multiplier,
        winAmount
      };
    });
  }, [round.multiplier]);

  const setBetAmount = useCallback((amount: number) => {
    setBet((prev) => ({
      ...prev,
      betAmount: Math.max(0, Math.round(amount * 100) / 100)
    }));
  }, []);

  useEffect(() => {
    if (round.phase !== "running" || timerRef.current !== null) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRound((prev) => {
        if (prev.phase !== "running") return prev;
        const growthRate = 0.007;
        const deltaSeconds = tickIntervalMs / 1000;
        const nextMultiplier = Number(
          (prev.multiplier * (1 + growthRate * deltaSeconds * 60)).toFixed(2)
        );

        if (nextMultiplier >= prev.maxMultiplier) {
          return { ...prev, multiplier: prev.maxMultiplier, phase: "crashed" };
        }

        return { ...prev, multiplier: nextMultiplier };
      });
    }, tickIntervalMs);

    return clearTimer;
  }, [round.phase, tickIntervalMs]);

  // Обратный отсчёт 5 сек: по окончании раунд стартует сам (ставки принимаются до конца отсчёта).
  useEffect(() => {
    if (round.phase !== "waiting" || countdownRef.current !== null) {
      return;
    }

    countdownRef.current = window.setInterval(() => {
      setRound((prev) => {
        if (prev.phase !== "waiting") return prev;
        if (prev.countdownSeconds <= 1) {
          clearCountdown();
          return {
            phase: "running",
            multiplier: 1,
            maxMultiplier: generateMaxMultiplier(),
            countdownSeconds: 0
          };
        }
        return { ...prev, countdownSeconds: prev.countdownSeconds - 1 };
      });
    }, 1000);

    return clearCountdown;
  }, [round.phase]);

  useEffect(() => {
    if (round.phase === "crashed") {
      clearTimer();
      clearCountdown();

      setHistory((prev) => {
        const next = [round.multiplier, ...prev];
        return next.slice(0, 8);
      });

      const timeout = window.setTimeout(() => {
        setRound({
          phase: "waiting",
          multiplier: 1,
          maxMultiplier: generateMaxMultiplier(),
          countdownSeconds: 5
        });
        setBet((prev) => ({
          ...prev,
          hasBet: false,
          cashedOut: false,
          cashoutMultiplier: null,
          winAmount: null
        }));
      }, 1500);

      return () => window.clearTimeout(timeout);
    }
    return;
  }, [round.phase, round.multiplier]);

  const rocketHeightProgress =
    round.phase === "running"
      ? Math.min(1, (round.multiplier - 1) / (round.maxMultiplier - 1 || 1))
      : round.phase === "crashed"
      ? 1
      : 0;

  return {
    round,
    bet,
    history,
    placeBet,
    startRound,
    crashNow,
    cashout,
    setBetAmount,
    rocketHeightProgress
  };
}

function generateMaxMultiplier() {
  const base = MIN_MAX_MULTIPLIER + Math.random() * (MAX_MAX_MULTIPLIER - MIN_MAX_MULTIPLIER);
  return Number(base.toFixed(2));
}

