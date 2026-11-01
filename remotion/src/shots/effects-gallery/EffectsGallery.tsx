import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { Checklist, Documentary, GlassWidgets, Orbit, SplitCompare, Spotlight, Timeline } from '../../lib/effects';

// =============================================================================
// COMPOSITION CONFIG: the effects gallery. Every effect in lib/effects, four seconds each,
// with real content over the documentary stills, so the library can be checked by eye and an
// effect can be previewed alone by rendering its frame range (see the skill's effects mode).
// =============================================================================
export const compositionConfig = {
  id: 'EffectsGallery',
  durationInSeconds: 28,
  fps: 30,
  width: 1080,
  height: 1920,
};

const SEG = 120;
const DOC = 'projects/doc-1';

const Plate: React.FC<{ name: string; dim?: number }> = ({ name, dim = 0.35 }) => (
  <AbsoluteFill>
    <Img src={staticFile(`${DOC}/${name}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <AbsoluteFill style={{ background: `rgba(8,12,18,${dim})` }} />
  </AbsoluteFill>
);

const Label: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 30, letterSpacing: 4, color: COLORS.onNightSoft }}>{name}</div>
);

export const EFFECTS_ORDER = ['checklist', 'timeline', 'glass-widgets', 'spotlight', 'orbit', 'split-compare', 'documentary'] as const;

const EffectsGallery: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.night }}>
    <Sequence durationInFrames={SEG}>
      <Plate name="04-surulere-designer" dim={0.55} />
      <Checklist
        len={SEG}
        ground="glass"
        title="What you take home"
        items={[
          { text: 'Your website, online', at: 8 },
          { text: 'Your own app, started', at: 22 },
          { text: 'The Project Blueprint', at: 36 },
          { text: 'Both recordings', at: 50 },
          { text: 'The Lab WhatsApp group', at: 64 },
        ]}
      />
      <Label name="checklist" />
    </Sequence>
    <Sequence from={SEG} durationInFrames={SEG}>
      <Timeline
        len={SEG}
        items={[
          { when: 'FRI 13 NOV, 7PM', label: 'Your first site in 30 minutes', at: 6 },
          { when: 'FRI 13 NOV, 10PM', label: 'Online at a link you can send', at: 26 },
          { when: 'SAT 14 NOV, 10AM', label: 'A look of its own', at: 46 },
          { when: 'SAT 14 NOV, 1PM', label: 'Your own app, started', at: 66 },
        ]}
      />
      <Label name="timeline" />
    </Sequence>
    <Sequence from={SEG * 2} durationInFrames={SEG}>
      <Plate name="05-lagos-night" dim={0.15} />
      <GlassWidgets
        len={SEG}
        cards={[
          { to: 36, fmt: (n) => `${Math.round(n)}M+`, label: 'developers joined GitHub in a year', source: 'GitHub Octoverse 2025', at: 6 },
          { value: 'Nearly 80%', label: 'of new developers use AI in their first week', source: 'GitHub Octoverse 2025', at: 26 },
        ]}
        chips={[{ text: 'Nigeria, a market to watch', at: 50 }, { text: 'AI skills, fastest growing', at: 58 }]}
      />
      <Label name="glass-widgets" />
    </Sequence>
    <Sequence from={SEG * 3} durationInFrames={SEG}>
      <Plate name="06-over-shoulder" dim={0} />
      <Spotlight
        len={SEG}
        targets={[
          { x: 700, y: 1160, r: 230, at: 8, label: 'The plan comes first' },
          { x: 420, y: 1500, r: 170, at: 62, label: 'Then the AI builds it' },
        ]}
      />
      <Label name="spotlight" />
    </Sequence>
    <Sequence from={SEG * 4} durationInFrames={SEG}>
      <Orbit
        len={SEG}
        centre="Creating with AI"
        items={[
          { text: 'Websites', at: 12 },
          { text: 'Apps', at: 22 },
          { text: 'Client work', at: 32 },
          { text: 'Automations', at: 42 },
          { text: 'Your own product', at: 52 },
        ]}
      />
      <Label name="orbit" />
    </Sequence>
    <Sequence from={SEG * 5} durationInFrames={SEG}>
      <SplitCompare
        len={SEG}
        a={{ title: 'Prompt and hope', img: `${DOC}/03-ikeja-corps.jpg`, tone: 'lose', points: ['Looks AI-made', 'Breaks at login'] }}
        b={{ title: 'The Qodeup Way', img: `${DOC}/01-yaba-builder.jpg`, tone: 'win', points: ['A plan before the AI starts', 'Online in session one'] }}
        verdict="Plan it, build it, put it online"
        verdictAt={70}
      />
      <Label name="split-compare" />
    </Sequence>
    <Sequence from={SEG * 6} durationInFrames={SEG}>
      <Documentary len={SEG} src={`${DOC}/02-lekki-banker.jpg`} date="LEKKI, 2026" title="A banker, after work" subtitle="building his first website with AI" pan="right" />
      <Label name="documentary" />
    </Sequence>
  </AbsoluteFill>
);

export default EffectsGallery;
