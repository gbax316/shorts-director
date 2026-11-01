import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail } from './util';

// A chat thread on a phone, messages arriving one by one with a typing indicator before each:
// a conversation the viewer reads (a customer asking for your page, a client saying yes).
// WhatsApp-like in feel without copying its marks. `me` messages sit on the right.
export type ChatMsg = { text: string; me?: boolean; at: number; time?: string };
export type ChatThreadProps = { title: string; status?: string; msgs: ChatMsg[]; len: number; top?: number };

const Dots: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: 'flex', gap: 8, padding: '18px 22px' }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: '#8A9AA9', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 5) / 6)) }} />
    ))}
  </div>
);

export const ChatThread: React.FC<ChatThreadProps> = ({ title, status = 'online', msgs, len, top = 250 }) => {
  const f = useCurrentFrame();
  const w = FX_BOX.right - FX_BOX.left;
  const typing = msgs.find((m) => f >= m.at - 16 && f < m.at && !m.me);
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: w, height: 1080, borderRadius: 48, overflow: 'hidden', background: '#0E1A17', boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 0 0 3px #26332F', ...rise(f, 0, 40) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '26px 30px', background: '#16251F' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: COLORS.signal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 30, color: '#FFFFFF' }}>{title.slice(0, 1)}</div>
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 36, color: '#EAF2EE' }}>{title}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: '#8FB3A3' }}>{typing ? 'typing...' : status}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '28px 26px' }}>
          {msgs.filter((m) => f >= m.at).map((m, i) => {
            const t = EASE_OUT(prog(f, m.at, m.at + 8));
            return (
              <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '18px 24px', borderRadius: 26, borderTopRightRadius: m.me ? 6 : 26, borderTopLeftRadius: m.me ? 26 : 6, background: m.me ? '#1F6E5A' : '#24312C', transform: `translateY(${(1 - t) * 20}px) scale(${0.94 + 0.06 * t})`, opacity: t }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 36, lineHeight: 1.25, color: '#F2F7F4' }}>{m.text}</div>
                {m.time ? <div style={{ marginTop: 6, textAlign: 'right', fontFamily: FONT_BODY, fontSize: 20, color: '#9DBBAE' }}>{m.time}</div> : null}
              </div>
            );
          })}
          {typing ? <div style={{ alignSelf: 'flex-start', borderRadius: 26, background: '#24312C' }}><Dots f={f} /></div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
