import React from "react";

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <button type="button" className="bottom-nav-item">
        <div className="bottom-nav-item-icon">
          <img src="/winner.png" alt="" />
        </div>
        <span className="bottom-nav-item-label">Топ</span>
      </button>
      <button type="button" className="bottom-nav-item bottom-nav-item--active">
        <div className="bottom-nav-item-icon">
          <img src="/newroketa.png" alt="" />
        </div>
        <span className="bottom-nav-item-label">Краш</span>
      </button>
      <button type="button" className="bottom-nav-item">
        <div className="bottom-nav-item-icon">
          <img src="/user.png" alt="" />
        </div>
        <span className="bottom-nav-item-label">Профиль</span>
      </button>
    </nav>
  );
};

