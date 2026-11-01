import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// A closing prompt that gives the viewer a reason to act: send it to someone it fits (sends are a
// ranking signal on Instagram), or answer a real question in the comments. Name a specific person
// or a specific question; a generic "like and subscribe" or "comment YES" earns nothing.
export type SharePromptProps = {
  kind: 'send' | 'comment';
  line: string; // "Send this to the friend who keeps saying they'll start next month"
  sub?: string;
  len: number;
  ground?: Ground;
  top?: number;
};

const Icon: React.FC<{ kind: 'send' | 'comment'; color: string }> = ({ kind, color }) =>
  kind === 'send' ? (
    <svg width="96" height="96" viewBox="0 0 48 48"><path d="M6 23 L42 7 L30 41 L23 27 Z" fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" /><path d="M23 27 L42 7" stroke={color} strokeWidth="3.5" /></svg>
  ) : (
    <svg width="96" height="96" viewBox="0 0 48 48"><path d="M8 10 H40 V32 H22 L12 40 V32 H8 Z" fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" /></svg>
  );

export const SharePrompt: React.FC<SharePromptProps> = ({ kind, line, sub, len, ground, top = 560 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const nudge = 1 + 0.06 * Math.sin(prog(f, 18, 60) * Math.PI * 3) * (1 - prog(f, 40, 60));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', transform: `scale(${EASE_OUT(prog(f, 0, 12)) * nudge})` }}><Icon kind={kind} color={fx.accent} /></div>
        <div style={{ marginTop: 24, fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: fx.text, ...rise(f, 6, 22) }}>{line}</div>
        {sub ? <div style={{ marginTop: 18, fontFamily: FONT_BODY, fontSize: 38, color: fx.soft, ...rise(f, 14, 16) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
