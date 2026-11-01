import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE_INOUT, prog } from '../shorts';

// 2.5D depth for a still: the background drifts and pushes slowly, the subject moves a little
// more, so the picture feels like a place instead of a photo sliding past. The default way a
// documentary still moves. Make the layers with tools/parallax_layers.py (<still>-fg.png on
// transparency, <still>-bg.jpg with the subject painted out). Keep `depth` small: the painted
// background behind the subject is rough, and a big drift shows it.
export type ParallaxProps = {
  bg: string; // under the media root, e.g. projects/doc-1/02-lekki-banker-bg.jpg
  fg: string; // e.g. projects/doc-1/02-lekki-banker-fg.png
  len: number;
  move?: 'push' | 'drift-left' | 'drift-right' | 'rise';
  depth?: number; // how far the subject travels beyond the background, in pixels
  children?: React.ReactNode; // overlays that should sit between the layers (rare)
};

export const Parallax: React.FC<ParallaxProps> = ({ bg, fg, len, move = 'push', depth = 26, children }) => {
  const f = useCurrentFrame();
  const t = EASE_INOUT(prog(f, 0, len));
  const dir = { push: [0, 0], 'drift-left': [-1, 0], 'drift-right': [1, 0], rise: [0, -1] }[move];
  const bgScale = 1.06 + 0.03 * t;
  const fgScale = 1.06 + (move === 'push' ? 0.07 : 0.035) * t;
  const bgShift = [dir[0] * depth * 0.4 * t, dir[1] * depth * 0.4 * t];
  const fgShift = [dir[0] * depth * t, dir[1] * depth * t];
  const layer: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '50% 60%' };
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(bg)} style={{ ...layer, transform: `translate(${bgShift[0]}px, ${bgShift[1]}px) scale(${bgScale})` }} />
      {children}
      <Img src={staticFile(fg)} style={{ ...layer, transform: `translate(${fgShift[0]}px, ${fgShift[1]}px) scale(${fgScale})` }} />
    </AbsoluteFill>
  );
};
