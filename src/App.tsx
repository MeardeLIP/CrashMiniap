import React from "react";
import { TopBar } from "./components/Layout/TopBar";
import { CrashScreen } from "./components/Crash/CrashScreen";
import { BottomNav } from "./components/BottomNav";
import "./styles/app-layout.css";

export const App: React.FC = () => {
  return (
    <div className="app-root">
      <div className="app-viewport">
        <div className="game-shell">
          <video
            className="game-shell-video"
            src={`${import.meta.env.BASE_URL}kosmos.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="game-shell-overlay" />
          <div className="game-shell-content">
            <TopBar />
            <CrashScreen />
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

