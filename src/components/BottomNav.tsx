import React from "react";
import topIcon from "../../winner.png";
import crashIcon from "../../zaika.png";
import profileIcon from "../../user.png";

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <button type="button" className="bottom-nav-item">
        <div className="bottom-nav-item-icon">
          <img src={topIcon} alt="" />
        </div>
        <span className="bottom-nav-item-label">Топ</span>
      </button>
      <button type="button" className="bottom-nav-item bottom-nav-item--active">
        <div className="bottom-nav-item-icon">
          <img src={crashIcon} alt="" />
        </div>
        <span className="bottom-nav-item-label">Краш</span>
      </button>
      <button type="button" className="bottom-nav-item">
        <div className="bottom-nav-item-icon">
          <img src={profileIcon} alt="" />
        </div>
        <span className="bottom-nav-item-label">Профиль</span>
      </button>
    </nav>
  );
};

