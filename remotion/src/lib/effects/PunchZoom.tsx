import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE_OUT, prog } from '../shorts';

// A camera punch-in on the beat: the picture (passed as children) jumps closer on a hit word or
// sound and eases back. Emphasis, used sparingly: on every line it stops meaning anything.
// hits[].at is the frame of the punch; `to` is how close it goes; (x, y) is where it aims.
export type PunchZoomProps = {
  hits: { at: number; to?: number; x?: number; y?: number; hold?: number }[];
  children: React.ReactNode;
};

export const PunchZoom: React.FC<PunchZoomProps> = ({ hits, children }) => {
  const f = useCurrentFrame();
  let scale = 1;
  let ox = 540;
  let oy = 960;
  for (const h of hits) {
    const hold = h.hold ?? 14;
    const inT = prog(f, h.at, h.at + 3); // the punch is fast
    const outT = EASE_OUT(prog(f, h.at + 3 + hold, h.at + 3 + hold + 12));
    const amount = ((h.to ?? 1.18) - 1) * inT * (1 - outT);
    if (amount > scale - 1) {
      scale = 1 + amount;
      ox = h.x ?? 540;
      oy = h.y ?? 960;
    }
  }
  return <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px` }}>{children}</AbsoluteFill>;
};
