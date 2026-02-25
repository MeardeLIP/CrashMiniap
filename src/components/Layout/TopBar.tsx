import React from "react";
import { useDraggable } from "../../hooks/useDraggable";
import yellowTonIcon from "../../../yellowton.png";

export const TopBar: React.FC = () => {
  const onlineDrag = useDraggable({ id: "topbar-online" });
  const balanceDrag = useDraggable({ id: "topbar-balance" });

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="online-indicator" style={onlineDrag.style}>
          <div className="online-indicator-glow">
            <span className="online-indicator-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5.5" r="3" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </span>
            <span className="online-indicator-value">116</span>
          </div>
        </div>
      </div>
      <div className="top-bar-right">
          <div className="balance-chip" style={balanceDrag.style}>
            <div className="balance-chip-amount">
              <img className="balance-gem" src={yellowTonIcon} alt="" />
              <span>0.00</span>
            </div>
          <div className="balance-plus">+</div>
        </div>
      </div>
    </header>
  );
};

