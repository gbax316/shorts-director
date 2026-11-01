import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_HEADLINE, FONT_MONO } from '../../fonts';
import { EASE_INOUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// A quote or a line from a page, set like print, with a marker sweeping across the words that
// matter: the viewer reads the source and sees which part counts. Used for a real quotation with
// its source, or the owner's own words from their page.
export type HighlightQuoteProps = {
  parts: { text: string; mark?: boolean }[]; // the quote in pieces; marked pieces get the highlighter
  source?: string;
  markAt: number; // frame the first marker starts; each marked piece follows 12 frames later
  len: number;
  ground?: Ground;
  top?: number;
};

export const HighlightQuote: React.FC<HighlightQuoteProps> = ({ parts, source, markAt, len, ground, top = 380 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  let k = 0;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, padding: '50px 46px', borderRadius: 30, background: fx.panel, boxShadow: fx.night ? 'none' : '0 18px 50px rgba(11,13,16,0.12)', ...rise(f, 0, 26) }}>
        <div style={{ fontFamily: FONT_HEADLINE, fontSize: 70, lineHeight: 1.18, color: fx.text }}>
          {parts.map((p, i) => {
            if (!p.mark) return <span key={i}>{p.text}</span>;
            const at = markAt + k++ * 12;
            const t = EASE_INOUT(prog(f, at, at + 14));
            return (
              <span key={i} style={{ backgroundImage: `linear-gradient(${COLORS.warn}, ${COLORS.warn})`, backgroundRepeat: 'no-repeat', backgroundSize: `${t * 100}% 86%`, backgroundPosition: '0 60%', color: t > 0.35 ? COLORS.night : fx.text, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', padding: '0 4px' }}>{p.text}</span>
            );
          })}
        </div>
        {source ? <div style={{ marginTop: 26, fontFamily: FONT_MONO, fontSize: 28, color: fx.soft }}>{source}</div> : null}
      </div>
      <div style={{ position: 'absolute', top: top - 60, left: FX_BOX.left + 20, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 160, lineHeight: 1, color: fx.accent, ...rise(f, 4, 20) }}>“</div>
    </AbsoluteFill>
  );
};
