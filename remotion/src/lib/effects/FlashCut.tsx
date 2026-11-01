import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { prog } from '../shorts';

// A transition placed over a cut: a white flash, or a whip (a fast streaked slide), lasting a few
// frames either side of the cut at frame `at`. For a change of time, place or energy; a hard cut is
// still the default join, and a flash on every cut stops meaning anything.
export type FlashCutProps = { at: number; kind?: 'flash' | 'whip'; dir?: 1 | -1; frames?: number };

export const FlashCut: React.FC<FlashCutProps> = ({ at, kind = 'flash', dir = 1, frames = 6 }) => {
  const f = useCurrentFrame();
  const up = prog(f, at - frames, at);
  const down = prog(f, at, at + frames);
  const peak = up * (1 - down);
  if (peak <= 0) return null;
  if (kind === 'flash') return <AbsoluteFill style={{ background: '#FFFFFF', opacity: peak * 0.9 }} />;
  const x = dir * (f < at ? -1 + up : down) * 1080;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 540, width: 2160, background: `linear-gradient(90deg, transparent, ${COLORS.warn}66 30%, #FFFFFFcc 50%, ${COLORS.warn}66 70%, transparent)`, filter: 'blur(18px)', opacity: peak }} />
    </AbsoluteFill>
  );
};
