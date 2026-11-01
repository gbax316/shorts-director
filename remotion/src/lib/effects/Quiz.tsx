import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// Pause-and-guess: a question, a few options, a timer bar that runs down, then the answer lights
// up. It asks the viewer to commit to a guess, which is what keeps them for the reveal; the answer
// must pay off honestly. answer is the index of the right option.
export type QuizProps = {
  question: string;
  options: string[];
  answer: number;
  timerFrom: number; // frame the timer starts
  revealAt: number; // frame the answer lights up
  len: number;
  ground?: Ground;
  top?: number;
};

export const Quiz: React.FC<QuizProps> = ({ question, options, answer, timerFrom, revealAt, len, ground, top = 300 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const w = FX_BOX.right - FX_BOX.left;
  const left = 1 - prog(f, timerFrom, revealAt);
  const shown = EASE_OUT(prog(f, revealAt, revealAt + 10));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: w, ...rise(f, 0, 24) }}>
        <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 66, lineHeight: 1.08, color: fx.text }}>{question}</div>
        <div style={{ marginTop: 26, height: 12, borderRadius: 6, background: fx.line, overflow: 'hidden' }}>
          <div style={{ width: `${left * 100}%`, height: '100%', background: left < 0.3 ? COLORS.danger : fx.accent }} />
        </div>
      </div>
      {options.map((o, i) => {
        const right = i === answer;
        const lit = right ? shown : 0;
        const dim = !right ? shown : 0;
        return (
          <div key={i} style={{ position: 'absolute', top: top + 300 + i * 150, left: FX_BOX.left, width: w, padding: '28px 34px', borderRadius: 28, background: lit > 0 ? COLORS.signalAlt : fx.panel, border: `3px solid ${lit > 0 ? COLORS.signalAlt : fx.line}`, display: 'flex', alignItems: 'center', gap: 22, opacity: 1 - 0.5 * dim, ...rise(f, 10 + i * 6, 20) }}>
            <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 44, color: lit > 0 ? COLORS.night : fx.accent }}>{String.fromCharCode(65 + i)}</div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 42, color: lit > 0 ? COLORS.night : fx.text }}>{o}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
