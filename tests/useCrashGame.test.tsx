import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCrashGame } from "../src/hooks/useCrashGame";

describe("useCrashGame", () => {
  it("starts in waiting phase with multiplier 1", () => {
    const { result } = renderHook(() => useCrashGame({ tickIntervalMs: 20 }));
    expect(result.current.round.phase).toBe("waiting");
    expect(result.current.round.multiplier).toBe(1);
    expect(result.current.round.countdownSeconds).toBeGreaterThan(0);
  });

  it("autostarts round after countdown and eventually crashes, then restarts", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useCrashGame({ tickIntervalMs: 10 }));

    act(() => {
      // Ждём пока закончится обратный отсчёт и раунд запустится автоматически.
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.round.phase).toBe("running");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.round.multiplier).toBeGreaterThan(1);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.round.phase).toBe("crashed");
    const crashedMultiplier = result.current.round.multiplier;
    expect(crashedMultiplier).toBeGreaterThan(1);

    act(() => {
      // Ждём пока игра вернётся в ожидание и запустит новый отсчёт.
      vi.advanceTimersByTime(6_000);
    });

    expect(result.current.round.phase).toBe("waiting");
    // История должна содержать хотя бы один множитель из завершённого раунда.
    expect(result.current.history.length).toBeGreaterThanOrEqual(1);
    expect(result.current.history[0]).toBeCloseTo(crashedMultiplier, 2);
    vi.useRealTimers();
  });

  it("calculates win amount when cashing out before crash", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useCrashGame({ tickIntervalMs: 10 }));

    act(() => {
      result.current.setBetAmount(10);
      result.current.startRound();
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const multiplierAtCashout = result.current.round.multiplier;

    act(() => {
      result.current.cashout();
    });

    expect(result.current.bet.cashedOut).toBe(true);
    expect(result.current.bet.winAmount).not.toBeNull();
    expect(result.current.bet.winAmount).toBeCloseTo(10 * multiplierAtCashout, 2);

    vi.useRealTimers();
  });
});

