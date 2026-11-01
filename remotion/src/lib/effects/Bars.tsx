import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// Horizontal bars that grow to their values one after another, the highlighted one in the accent
// colour: a comparison of a few quantities the viewer should rank at a glance. Values are drawn to
// scale against the largest, so the bars never exaggerate. Any figure here needs its source.
export type BarsProps = {
  title?: string;
  bars: { label: string; value: number; show?: string; hi?: boolean }[];
  source?: string;
  at?: number;
  len: number;
  ground?: Ground;
  top?: number;
};

export const Bars: React.FC<BarsProps> = ({ title, bars, source, at = 8, len, ground, top = 360 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const max = Math.max(...bars.map((b) => b.value), 1);
  const w = FX_BOX.right - FX_BOX.left;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: w }}>
        {title ? <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 58, lineHeight: 1.08, color: fx.text, marginBottom: 34, ...rise(f, 0, 20) }}>{title}</div> : null}
        {bars.map((b, i) => {
          const t = EASE_OUT(prog(f, at + i * 10, at + i * 10 + 24));
          return (
            <div key={i} style={{ marginBottom: 30, ...rise(f, at + i * 10, 16) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 38, color: fx.text, marginBottom: 10 }}>
                <span>{b.label}</span>
                <span style={{ color: b.hi ? fx.accent : fx.soft, opacity: t }}>{b.show ?? b.value.toLocaleString('en-GB')}</span>
              </div>
              <div style={{ height: 44, borderRadius: 14, background: fx.line, overflow: 'hidden' }}>
                <div style={{ width: `${(b.value / max) * 100 * t}%`, height: '100%', borderRadius: 14, background: b.hi ? fx.accent : fx.soft }} />
              </div>
            </div>
          );
        })}
        {source ? <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 26, color: fx.soft }}>Source: {source}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
