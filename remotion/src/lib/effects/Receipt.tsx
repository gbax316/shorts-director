import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail } from './util';

// A receipt that prints line by line: what the viewer gets, each line with its worth, then the
// total and what they actually pay. For an offer beat. Every value must be real (a price the owner
// charges, a product that exists); an invented "worth" is the advert tone the house rules forbid.
export type ReceiptProps = {
  title: string;
  lines: { item: string; value?: string; at: number }[];
  total?: { label: string; value: string; at: number };
  len: number;
  top?: number;
};

export const Receipt: React.FC<ReceiptProps> = ({ title, lines, total, len, top = 280 }) => {
  const f = useCurrentFrame();
  const last = Math.max(...lines.map((l) => l.at), total?.at ?? 0);
  const paper = EASE_OUT(prog(f, 0, last + 10));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left + 30, width: FX_BOX.right - FX_BOX.left - 60, padding: '40px 40px 50px', background: '#FBF8F1', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', clipPath: `inset(0 0 ${(1 - paper) * 100}% 0)`, ...rise(f, 0, 30) }}>
        <div style={{ textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: '#1C1F24' }}>{title}</div>
        <div style={{ borderTop: '3px dashed #B9B2A6', margin: '24px 0' }} />
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '10px 0', fontFamily: FONT_MONO, fontSize: 32, color: '#1C1F24', ...rise(f, l.at, 10) }}>
            <span>{l.item}</span>
            {l.value ? <span style={{ whiteSpace: 'nowrap' }}>{l.value}</span> : null}
          </div>
        ))}
        {total ? (
          <>
            <div style={{ borderTop: '3px dashed #B9B2A6', margin: '20px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BODY, fontWeight: 800, fontSize: 46, color: COLORS.accentOnDay, ...rise(f, total.at, 14) }}>
              <span>{total.label}</span>
              <span>{total.value}</span>
            </div>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
