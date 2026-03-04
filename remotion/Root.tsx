import React from "react";
import { Composition } from "remotion";
import { StoreProvider } from "./providers/StoreProvider";
import { PlatformOverview } from "./compositions/PlatformOverview";
import { PlatformOverviewV2 } from "./compositions/PlatformOverviewV2";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "./lib/brand";

export const RemotionRoot: React.FC = () => {
  return (
    <StoreProvider>
      <Composition
        id="PlatformOverview"
        component={PlatformOverview}
        durationInFrames={1140}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="PlatformOverviewV2"
        component={PlatformOverviewV2}
        durationInFrames={1800}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </StoreProvider>
  );
};
