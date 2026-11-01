import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// Two sides stacked top and bottom (9:16 has no room for side by side), a divider that wipes
// across, and an optional verdict on the winning side. Use it for before and after, them and us,
// the old way and the new way.
export type Side = { title: string; img?: string; points?: string[]; tone?: 'lose' | 'win' };
export type SplitCompareProps = { a: Side; b: Side; len: number; verdictAt?: number; verdict?: string; ground?: Ground };

const Half: React.FC<{ side: Side; top: number; h: number; at: number; f: number; bg: string; text: string }> = ({ side, top, h, at, f, bg, text }) => {
  const col = side.tone === 'win' ? COLORS.signalAlt : side.tone === 'lose' ? COLORS.danger : COLORS.warn;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: h, overflow: 'hidden', background: bg }}>
      {side.img ? <Img src={staticFile(side.img)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} /> : null}
      <div style={{ position: 'absolute', left: FX_BOX.left, right: 1080 - FX_BOX.right, top: 70, ...rise(f, at, 26) }}>
        <div style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 14, background: col, fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 56, color: COLORS.night }}>{side.title}</div>
        {(side.points ?? []).map((p, i) => (
          <div key={i} style={{ marginTop: 22, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, lineHeight: 1.2, color: side.img ? COLORS.onNight : text, textShadow: side.img ? '0 2px 12px rgba(0,0,0,0.6)' : 'none', ...rise(f, at + 8 + i * 8, 18) }}>{p}</div>
        ))}
      </div>
    </div>
  );
};

export const SplitCompare: React.FC<SplitCompareProps> = ({ a, b, len, verdictAt, verdict, ground }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const mid = 960;
  const wipe = EASE_OUT(prog(f, 0, 16));
  const v = verdictAt !== undefined ? EASE_OUT(prog(f, verdictAt, verdictAt + 12)) : 0;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <Half side={a} top={0} h={mid} at={4} f={f} bg={fx.panel} text={fx.text} />
      <Half side={b} top={mid} h={1920 - mid} at={14} f={f} bg={fx.panel} text={fx.text} />
      <div style={{ position: 'absolute', left: 0, top: mid - 4, height: 8, width: 1080 * wipe, background: COLORS.warn }} />
      <div style={{ position: 'absolute', left: 540 - 56, top: mid - 56, width: 112, height: 112, borderRadius: 56, background: COLORS.warn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 44, color: COLORS.night, transform: `scale(${wipe})` }}>VS</div>
      {verdict ? (
        <div style={{ position: 'absolute', left: FX_BOX.left, right: 1080 - FX_BOX.right, top: FX_BOX.bottom - 110, textAlign: 'center', opacity: v, transform: `scale(${0.9 + 0.1 * v})` }}>
          <span style={{ display: 'inline-block', padding: '16px 30px', borderRadius: 20, background: COLORS.signalAlt, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 44, color: COLORS.night }}>{verdict}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
