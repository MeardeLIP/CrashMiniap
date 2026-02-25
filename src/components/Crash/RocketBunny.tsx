import React from "react";
import type { CSSProperties } from "react";
import rocketBunnyImg from "../../../zaika.png";

type RocketBunnyProps = {
  flying: boolean;
  crashed: boolean;
  heightProgress: number;
};

export const RocketBunny: React.FC<RocketBunnyProps> = ({ flying, crashed, heightProgress }) => {
  const clampedProgress = Math.max(0, Math.min(1, heightProgress));

  const wrapperStyle: CSSProperties = {
    ["--rocket-height" as string]: clampedProgress
  };

  const bodyClassNames = ["rocket-body", flying ? "rocket-floating" : "", crashed ? "rocket-shake" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rocket-layer">
      <div className="rocket-wrapper" style={wrapperStyle}>
        {flying && (
          <div className="rocket-trail" aria-hidden>
            <span className="rocket-trail__line" />
            <span className="rocket-trail__line rocket-trail__line--2" />
            <span className="rocket-trail__line rocket-trail__line--3" />
            <span className="rocket-trail__glow" />
          </div>
        )}
        <div className={bodyClassNames}>
          <img
            className={"rocket-bunny-image" + (flying ? " rocket-bunny-image--flying" : "")}
            src={rocketBunnyImg}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

