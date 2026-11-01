import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_INOUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// One frame, two states: a slider wipes across from the before to the after (an AI-looking site to
// one with its own look, a cluttered day to an organised one). Both pictures must share framing so
// the change is the only thing that moves. `children` can replace the images with drawn screens.
export type BeforeAfterProps = {
  before: string;
  after: string;
  wipeFrom: number;
  wipeTo: number;
  beforeLabel?: string;
  afterLabel?: string;
  len: number;
};

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ before, after, wipeFrom, wipeTo, beforeLabel = 'Before', afterLabel = 'After', len }) => {
  const f = useCurrentFrame();
  const t = EASE_INOUT(prog(f, wipeFrom, wipeTo));
  const x = 1080 * (1 - t);
  const tag = (text: string, side: 'l' | 'r', on: number) => (
    <div style={{ position: 'absolute', top: FX_BOX.top + 20, [side === 'l' ? 'left' : 'right']: side === 'l' ? FX_BOX.left : 1080 - FX_BOX.right, padding: '10px 22px', borderRadius: 14, background: side === 'l' ? COLORS.danger : COLORS.signalAlt, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 36, color: COLORS.night, opacity: on }}>{text}</div>
  );
  const cover: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <Img src={staticFile(after)} style={cover} />
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${1080 - x}px 0 0)` }}>
        <Img src={staticFile(before)} style={cover} />
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 3, width: 6, background: '#FFFFFF', boxShadow: '0 0 20px rgba(0,0,0,0.5)', opacity: t > 0 && t < 1 ? 1 : 0 }} />
      <div style={{ position: 'absolute', left: x - 34, top: 900, width: 68, height: 68, borderRadius: 34, background: '#FFFFFF', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', opacity: t > 0 && t < 1 ? 1 : 0 }} />
      {tag(beforeLabel, 'l', 1 - t)}
      {tag(afterLabel, 'r', t)}
    </AbsoluteFill>
  );
};
