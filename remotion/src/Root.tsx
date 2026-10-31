import React from 'react';
import { Composition } from 'remotion';
import { shots } from './registry.gen';
import { BRAND_GROUND, GroundContext } from './brand';

// Each shot renders inside its ground (compositionConfig.ground, else the brand default),
// so kit components pick day or night colours without every shot passing them.
const grounded = shots.map(({ Comp, config }) => {
  const Grounded: React.FC = () => (
    <GroundContext.Provider value={config.ground ?? BRAND_GROUND}>
      <Comp />
    </GroundContext.Provider>
  );
  return { Comp: Grounded, config };
});

// Every shot file exports `compositionConfig` + a default component. gen-registry.mjs
// discovers them into registry.gen. This maps each to a <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {grounded.map(({ Comp, config }) => (
        <Composition
          key={config.id}
          id={config.id}
          component={Comp as React.FC}
          durationInFrames={Math.max(1, Math.round(config.durationInSeconds * config.fps))}
          fps={config.fps}
          width={config.width}
          height={config.height}
        />
      ))}
    </>
  );
};
