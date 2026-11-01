import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// A name and role tag that slides in above the caption band and out again: who is speaking or who
// a person on screen is (a lead facilitator, a client with their permission). Short, and never on
// an invented person presented as real.
export type LowerThirdProps = { name: string; role?: string; len: number; inAt?: number; outAt?: number };

export const LowerThird: React.FC<LowerThirdProps> = ({ name, role, len, inAt = 4, outAt }) => {
  const f = useCurrentFrame();
  const out = outAt ?? len - 14;
  const t = EASE_OUT(prog(f, inAt, inAt + 12)) * (1 - EASE_OUT(prog(f, out, out + 10)));
  const bar = EASE_OUT(prog(f, inAt, inAt + 8));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: FX_BOX.left, bottom: 1920 - FX_BOX.bottom + 30, display: 'flex', alignItems: 'stretch', transform: `translateX(${(1 - t) * -60}px)`, opacity: t }}>
        <div style={{ width: 10, borderRadius: 5, background: COLORS.warn, transform: `scaleY(${bar})` }} />
        <div style={{ marginLeft: 18, padding: '16px 26px', borderRadius: 18, background: 'rgba(8,12,18,0.82)' }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 44, color: '#FFFFFF' }}>{name}</div>
          {role ? <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 32, color: COLORS.warn }}>{role}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
