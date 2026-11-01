import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL, FONT_HEADLINE, FONT_MONO } from '../../fonts';
import { Captions, EASE_OUT, ProgressBar, prog } from '../../lib/shorts';
import { EndCard, PoweredBy, makeBed } from '../../lib/skit/cards';
import { LaptopScreen, PhoneScreen, Pinned } from './screens';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG: "The new builders", Qodeup mini documentary 1 (the no-cast proving run).
// ANIMATIC: generated stills on the narrator's timeline, every figure, source line, tag, screen and
// door drawn in code. Beats tagged CLIP become generated clips once Orezi signs off the animatic.
// Format rules: ai-shorts/series/qodeup-docs/BIBLE.md. Figures and sources: ai-shorts/doc-1/script.md.
// =============================================================================
export const compositionConfig = {
  id: 'Doc1Builders',
  durationInSeconds: 52.83,
  fps: 30,
  width: 1080,
  height: 1920,
};

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const DIR = 'projects/doc-1';
const ANIMATIC = true;
const END_CARD = s(47.23);
const CLOSING = s(43.5);
const bed = makeBed(VO, FPS);

const PLATES: { name: string; from: number; to: number; tag?: string; clip?: string }[] = [
  { name: '01-yaba-builder', from: 0, to: s(2.65), clip: 'CLIP: her hands type, a site builds on her screen' },
  { name: '02-lekki-banker', from: s(2.65), to: s(4.997), tag: 'LEKKI, 9:40 PM' },
  { name: '03-ikeja-corps', from: s(4.997), to: s(7.37), tag: 'IKEJA, 8:15 PM' },
  { name: '04-surulere-designer', from: s(7.37), to: s(10.04), tag: 'SURULERE, 10:05 PM' },
  { name: '05-lagos-night', from: s(10.04), to: s(17.66) },
  { name: '06-over-shoulder', from: s(17.66), to: s(24.8) },
  { name: '09-yaba-publish', from: s(32.11), to: CLOSING, clip: 'CLIP: she presses publish and smiles' },
];

// overlays pinned to the picture go in as children, so they ride the same slow push
const Plate: React.FC<{ name: string; len: number; children?: React.ReactNode }> = ({ name, len, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * prog(f, 0, len)})` }}>
      <Img src={staticFile(`${DIR}/${name}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {children}
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', top: 214, right: 40, maxWidth: 560, padding: '10px 18px', borderRadius: 14, background: 'rgba(188,56,42,0.92)', color: '#fff', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26 }}>
    {text}
  </div>
);

// beat 2: where and when, so the narration only has to say who
const PlaceTag: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, 2, 12));
  return (
    <div style={{ position: 'absolute', top: 190, left: 54, padding: '12px 20px', borderRadius: 12, background: 'rgba(12,22,34,0.72)', color: COLORS.onNight, fontFamily: FONT_MONO, fontWeight: 500, fontSize: 30, letterSpacing: 2, opacity: t, transform: `translateX(${(1 - t) * -30}px)` }}>
      {text}
    </div>
  );
};

// a figure lands, counts up and carries its source underneath
const Figure: React.FC<{ big: (t: number) => string; kicker?: string; label: string; source: string; len: number }> = ({ big, kicker, label, source, len }) => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, 0, 10)) * (1 - prog(f, len - 6, len));
  const count = EASE_OUT(prog(f, 2, 22));
  return (
    <div style={{ position: 'absolute', top: 300, left: 70, right: 70, padding: '34px 40px 30px', borderRadius: 26, background: 'rgba(12,22,34,0.78)', opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
      {kicker ? <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: COLORS.onNightSoft, marginBottom: 6 }}>{kicker}</div> : null}
      <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: COLORS.warn }}>{big(count)}</div>
      <div style={{ marginTop: 14, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 42, lineHeight: 1.2, color: COLORS.onNight }}>{label}</div>
      <div style={{ marginTop: 18, fontFamily: FONT_BODY, fontSize: 23, color: COLORS.onNightSoft }}>Source: {source}</div>
    </div>
  );
};

const FIGURES = [
  { at: s(11.0), to: s(14.4), big: (t: number) => `${Math.round(36 * t)}M+`, label: 'developers joined GitHub in the past year', source: 'GitHub Octoverse 2025' },
  { at: s(14.52), to: s(17.5), big: (t: number) => `+${(3.4 * t).toFixed(1)}M`, label: 'new developers in Africa and the Middle East, with Nigeria a stand-out market', source: 'GitHub Octoverse 2025' },
  { at: s(18.06), to: s(21.2), big: (t: number) => `${Math.round(80 * t)}%`, kicker: 'NEARLY', label: 'of new developers on GitHub use AI within their first week', source: 'GitHub Octoverse 2025' },
  { at: s(21.34), to: s(24.6), big: () => 'No. 1', label: 'AI and big data top the list of fastest-growing skills', source: 'WEF Future of Jobs Report 2025' },
];

// beat 3: laptops light up across the city, faster as the beat goes on
const MAP_PTS = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 160 }, (_, i) => ({ x: 40 + rnd() * 1000, y: 1150 + rnd() * 700, at: Math.pow(i / 160, 0.7) * s(6.8) }));
})();
const NightMap: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {MAP_PTS.map((p, i) => {
        const t = prog(f, p.at, p.at + 6);
        if (t <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: p.x - 6, top: p.y - 6, width: 12, height: 12, borderRadius: 6, background: i % 3 ? COLORS.warn : COLORS.cream, opacity: 0.35 + 0.65 * t, transform: `scale(${0.4 + 0.6 * t})`, boxShadow: `0 0 18px 6px ${COLORS.warn}88` }} />
        );
      })}
    </>
  );
};

// beat 5: each door swings open onto the next thing a builder makes
const Door: React.FC<{ label: string; len: number; children: React.ReactNode }> = ({ label, len, children }) => {
  const f = useCurrentFrame();
  const open = EASE_OUT(prog(f, 2, 16));
  const leaf = (side: 'left' | 'right') => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: 540, background: COLORS.navy, boxShadow: `inset 0 0 0 18px ${COLORS.surface}, inset 0 0 0 22px ${COLORS.warn}55`, transformOrigin: side, transform: `perspective(1800px) rotateY(${(side === 'left' ? -1 : 1) * 105 * open}deg)` }} />
  );
  const t = EASE_OUT(prog(f, 8, 18));
  return (
    <AbsoluteFill style={{ background: COLORS.night }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 - 0.06 * open + 0.02 * prog(f, 16, len)})` }}>{children}</AbsoluteFill>
      {leaf('left')}
      {leaf('right')}
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', opacity: t }}>
        <span style={{ padding: '14px 26px', borderRadius: 14, background: 'rgba(12,22,34,0.82)', color: COLORS.warn, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, letterSpacing: 3 }}>{label}</span>
      </div>
    </AbsoluteFill>
  );
};

const FirstSite: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.navy, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 860, borderRadius: 22, overflow: 'hidden', background: COLORS.paper, boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <div style={{ height: 54, background: COLORS.line, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px' }}>
        {['#BC382A', '#F2B21B', '#2BB3AB'].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        <span style={{ marginLeft: 18, fontFamily: FONT_MONO, fontSize: 24, color: COLORS.muted }}>yourname.site</span>
      </div>
      <div style={{ padding: '56px 50px 64px', fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 84, lineHeight: 1, color: COLORS.ink }}>
        Your first
        <br />
        website, live.
        <div style={{ marginTop: 34, display: 'inline-block', padding: '16px 30px', borderRadius: 999, background: COLORS.accent, color: '#fff', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 32 }}>Send an enquiry</div>
      </div>
    </div>
  </AbsoluteFill>
);

const OwnProduct: React.FC = () => {
  const f = useCurrentFrame();
  const draw = EASE_OUT(prog(f, 8, 34));
  return (
    <AbsoluteFill style={{ background: COLORS.navy, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 860, padding: '44px 48px', borderRadius: 26, background: COLORS.surface, boxShadow: `inset 0 0 0 1px ${COLORS.lineNight}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 56, color: COLORS.onNight }}>Your product</span>
          <span style={{ padding: '8px 18px', borderRadius: 999, background: `${COLORS.signalAlt}33`, color: COLORS.signalAlt, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26 }}>Live</span>
        </div>
        <svg width="764" height="300" viewBox="0 0 764 300" style={{ marginTop: 30 }}>
          <path d="M0 270 C120 250 180 230 260 200 S420 150 500 110 S660 40 764 20" fill="none" stroke={COLORS.warn} strokeWidth="8" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - draw)} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const DOORS = [
  { at: s(24.8), to: s(26.32), label: 'YOUR FIRST SITE', body: <FirstSite /> },
  { at: s(26.32), to: s(28.32), label: 'A BAKERY', body: <Img src={staticFile(`${DIR}/07-yaba-bakery.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> },
  {
    at: s(28.32),
    to: s(30.56),
    label: 'A SALON',
    body: (
      <AbsoluteFill>
        <Img src={staticFile(`${DIR}/08-salon-owner.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <Pinned w={220} h={460} quad={[[317, 932], [428, 941], [419, 1189], [307, 1182]]}>
          <PhoneScreen />
        </Pinned>
      </AbsoluteFill>
    ),
  },
  { at: s(30.56), to: s(32.11), label: 'YOUR OWN PRODUCT', body: <OwnProduct /> },
];

// beat 6: the class, as a card, once the narrator names Qodeup's lead facilitator (the dates live on the card)
const ClassCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, 0, 14));
  return (
    <div style={{ position: 'absolute', top: 290, left: 70, right: 70, padding: '36px 40px', borderRadius: 26, background: 'rgba(12,22,34,0.82)', opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
      <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 96, lineHeight: 1, color: COLORS.warn }}>Build With AI</div>
      <div style={{ marginTop: 16, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: COLORS.onNight }}>13 and 14 November, live online</div>
      <div style={{ marginTop: 22, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 34, color: COLORS.onNightSoft }}>Lead facilitator: Orezi Emeotu, Qodeup</div>
    </div>
  );
};

const Published: React.FC = () => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, 0, 10));
  return (
    <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center', opacity: t, transform: `scale(${0.9 + 0.1 * t})` }}>
      <span style={{ padding: '14px 28px', borderRadius: 999, background: COLORS.signal, color: '#fff', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 34 }}>Published</span>
    </div>
  );
};

// beat 7: the series line, word by word on the narrator's words
const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const words = VO[VO.length - 1].words ?? [];
  return (
    <AbsoluteFill style={{ background: COLORS.navy, alignItems: 'center', justifyContent: 'center', padding: '0 90px', opacity: prog(f, 0, 8) }}>
      <div style={{ fontFamily: FONT_HEADLINE, fontSize: 112, lineHeight: 1.08, textAlign: 'center', color: COLORS.onNight }}>
        {words.map((w) => {
          const t = EASE_OUT(prog(f, s(w.start) - CLOSING - 2, s(w.start) - CLOSING + 6));
          return (
            <span key={w.start} style={{ opacity: t, color: w.w.startsWith('AI') ? COLORS.warn : undefined }}>
              {w.w}{' '}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 50, width: 220 * EASE_OUT(prog(f, s(3), s(3.6))), height: 3, background: COLORS.warn }} />
    </AbsoluteFill>
  );
};

const CUT = [s(2.65), s(4.997), s(7.37), s(10.04), s(17.66), s(32.11)];
const CUES: { at: number; src: string; vol: number }[] = [
  { at: s(0.1), src: 'keys-typing-soft', vol: 0.35 },
  ...CUT.map((at) => ({ at, src: 'whoosh-soft', vol: 0.22 })),
  ...FIGURES.map((x) => ({ at: x.at, src: 'pop-reveal', vol: 0.4 })),
  { at: s(17.8), src: 'keys-typing-soft', vol: 0.3 },
  ...DOORS.map((d) => ({ at: d.at, src: 'whoosh-soft', vol: 0.3 })),
  { at: s(32.5), src: 'ui-click-soft', vol: 0.5 },
  { at: s(38.35), src: 'pop-reveal', vol: 0.35 },
  { at: s(41.9), src: 'riser-soft', vol: 0.3 },
  { at: CLOSING, src: 'warm-shimmer', vol: 0.35 },
  { at: END_CARD + 60, src: 'ui-send', vol: 0.35 },
];

const Doc1Builders: React.FC = () => {
  const lines = VO.slice(0, -1).map((l) => ({ ...l, accent: COLORS.accent }));
  return (
    <AbsoluteFill style={{ background: COLORS.night }}>
      {PLATES.map((p) => (
        <Sequence key={p.name} from={p.from} durationInFrames={p.to - p.from}>
          <Plate name={p.name} len={p.to - p.from}>
            {p.name === '05-lagos-night' ? <NightMap /> : null}
            {p.name === '06-over-shoulder' ? (
              <Pinned w={600} h={400} quad={[[463, 980], [970, 1000], [940, 1340], [428, 1295]]}>
                <LaptopScreen buildAt={s(20.22) - s(17.66)} />
              </Pinned>
            ) : null}
          </Plate>
          {p.tag ? <PlaceTag text={p.tag} /> : null}
          {ANIMATIC && p.clip ? <Tag text={p.clip} /> : null}
        </Sequence>
      ))}
      {FIGURES.map((x) => (
        <Sequence key={x.at} from={x.at} durationInFrames={x.to - x.at}>
          <Figure big={x.big} kicker={'kicker' in x ? x.kicker : undefined} label={x.label} source={x.source} len={x.to - x.at} />
        </Sequence>
      ))}
      {DOORS.map((d) => (
        <Sequence key={d.at} from={d.at} durationInFrames={d.to - d.at}>
          <Door label={d.label} len={d.to - d.at}>
            {d.body}
          </Door>
        </Sequence>
      ))}
      <Sequence from={s(32.5)} durationInFrames={s(38.2) - s(32.5)}>
        <Published />
      </Sequence>
      <Sequence from={s(38.35)} durationInFrames={CLOSING - s(38.35)}>
        <ClassCard />
      </Sequence>
      <Sequence from={CLOSING} durationInFrames={END_CARD - CLOSING}>
        <Closing />
      </Sequence>
      <Captions lines={lines} y={1450} size={54} maxWords={4} plate />
      <PoweredBy outAt={END_CARD} />
      <ProgressBar />
      <Sequence from={END_CARD}>
        <EndCard title="Build With AI" sub="13 and 14 November. Two live sessions." cta="Sign up now" url="qodeupafrica.com/build-with-ai/blueprint" />
      </Sequence>

      <Audio src={staticFile(`${DIR}/audio/voice.mp3`)} />
      <Audio src={staticFile(`${DIR}/audio/tech-pulse.mp3`)} volume={(fr) => Math.min(1, fr / 15) * (fr >= END_CARD ? 0.4 : bed(fr, 0.13, 0.26))} />
      <Sequence from={s(2.65)} durationInFrames={s(17.66) - s(2.65)}>
        <Audio src={staticFile(`${DIR}/audio/street.mp3`)} volume={(fr) => 0.06 * Math.min(1, fr / 20)} />
      </Sequence>
      {CUES.map((c, i) => (
        <Sequence key={i} from={c.at} durationInFrames={90}>
          <Audio src={staticFile(`${DIR}/audio/${c.src}.mp3`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Doc1Builders;
