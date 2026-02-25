import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrashScreen } from "../src/components/Crash/CrashScreen";

describe("CrashScreen", () => {
  it("renders initial waiting state with bet button", () => {
    render(<CrashScreen />);
    expect(screen.getAllByText(/Ожидание/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Сделать ставку/i })).toBeInTheDocument();
    // Ряд истории иксов над кнопкой.
    expect(screen.getAllByText(/1\.43/).length).toBeGreaterThan(0);
  });
});

