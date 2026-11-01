import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// The Kallaway split: someone talking in one half of the frame, the thing they are talking about
// in the other, and the caption riding the seam between them. In a faceless short the speaker is a
// character with synced mouths (a skit), a narrator's character, or the owner's own recording;
// the visual is a screen, b-roll or another effect passed as children. Use it when the viewer
// must see both who is talking and what they mean at once; for a single picture, use a full frame.
export type Pane = { video?: string; img?: string; startFrom?: number; focusY?: number };
export type SplitScreenProps = {
  speaker: Pane;
  visual?: Pane; // or pass the visual as children (a pinned screen, an effect)
  speakerSide?: 'top' | 'bottom';
  seamCaption?: string; // a short line on the seam; leave out when the main captions run
  len: number;
  split?: number; // y of the seam, default the middle
  children?: React.ReactNode;
};

const Media: React.FC<{ pane: Pane }> = ({ pane }) => {
  const style: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${pane.focusY ?? 50}%` };
  if (pane.video) return <OffthreadVideo src={staticFile(pane.video)} startFrom={pane.startFrom ?? 0} muted style={style} />;
  if (pane.img) return <Img src={staticFile(pane.img)} style={style} />;
  return null;
};

export const SplitScreen: React.FC<SplitScreenProps> = ({ speaker, visual, speakerSide = 'bottom', seamCaption, len, split = 960, children }) => {
  const f = useCurrentFrame();
  const open = EASE_OUT(prog(f, 0, 14));
  const seam = split + (speakerSide === 'bottom' ? 1 : -1) * (1 - open) * 120;
  const topPane = speakerSide === 'top' ? speaker : visual;
  const bottomPane = speakerSide === 'top' ? visual : speaker;
  const captionOn = EASE_OUT(prog(f, 10, 22));
  return (
    <AbsoluteFill style={{ background: COLORS.night, opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: seam, overflow: 'hidden' }}>
        {topPane ? <Media pane={topPane} /> : null}
        {speakerSide === 'bottom' ? children : null}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: seam, bottom: 0, overflow: 'hidden' }}>
        {bottomPane ? <Media pane={bottomPane} /> : null}
        {speakerSide === 'top' ? children : null}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: seam - 3, height: 6, background: COLORS.warn, opacity: open }} />
      {seamCaption ? (
        <div style={{ position: 'absolute', left: FX_BOX.left, right: 1080 - FX_BOX.right, top: seam - 46, textAlign: 'center', opacity: captionOn, transform: `scale(${0.92 + 0.08 * captionOn})` }}>
          <span style={{ display: 'inline-block', padding: '14px 26px', borderRadius: 16, background: COLORS.night, boxShadow: `inset 0 0 0 3px ${COLORS.warn}`, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 44, color: '#FFFFFF' }}>{seamCaption}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
