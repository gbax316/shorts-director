import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { GroundContext } from '../../brand';
import { Annotate, Bars, BeforeAfter, ChatThread, Checklist, Counter, Documentary, FlashCut, GlassWidgets, HighlightQuote, HookText, LowerThird, MapZoom, Notifications, Orbit, Parallax, PunchZoom, Quiz, RankReveal, Receipt, SearchBar, SharePrompt, SplitCompare, SplitScreen, Spotlight, StepCounter, Timeline } from '../../lib/effects';

// =============================================================================
// COMPOSITION CONFIG: the effects gallery. Every effect in lib/effects, four seconds each,
// with real content over the documentary stills, so the library can be checked by eye and an
// effect can be previewed alone by rendering its frame range (see the skill's effects mode).
// =============================================================================
export const compositionConfig = {
  id: 'EffectsGallery',
  durationInSeconds: 112,
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

export const EFFECTS_ORDER = ['checklist', 'timeline', 'glass-widgets', 'spotlight', 'orbit', 'split-compare', 'documentary', 'parallax', 'map-zoom', 'checklist (day ground)', 'split-screen (kallaway)', 'hook-text', 'punch-zoom', 'chat-thread', 'notifications', 'rank-reveal', 'quiz', 'highlight-quote', 'annotate', 'step-counter', 'share-prompt', 'counter', 'bars', 'search-bar', 'receipt', 'before-after', 'lower-third', 'flash-cut'] as const;

const EffectsGallery: React.FC = () => (
  <GroundContext.Provider value="night">
  <AbsoluteFill style={{ background: COLORS.night }}>
    <Sequence durationInFrames={SEG}>
      <Plate name="04-surulere-designer" dim={0.55} />
      <Checklist
        len={SEG}
        glass
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
        chips={[{ text: 'Nigeria, a market to watch', source: 'GitHub Octoverse 2025', at: 50 }, { text: 'AI skills, fastest growing', source: 'WEF 2025', at: 58 }]}
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
      <Documentary len={SEG} src={`${DOC}/03-ikeja-corps.jpg`} date="IKEJA, 2026" title="A corps member" subtitle="building between shifts" titlePlace="top" />
      <Label name="documentary" />
    </Sequence>
    <Sequence from={SEG * 7} durationInFrames={SEG}>
      <Parallax len={SEG} bg={`${DOC}/02-lekki-banker-bg.jpg`} fg={`${DOC}/02-lekki-banker-fg.png`} move="push" />
      <Label name="parallax" />
    </Sequence>
    <Sequence from={SEG * 8} durationInFrames={SEG}>
      <MapZoom
        len={SEG}
        ground="night"
        from={{ lon: [-20, 55], lat: [-36, 38] }}
        to={{ lon: [-8, 24], lat: [-1, 18] }}
        country="Nigeria"
        pin={{ lon: 3.38, lat: 6.52, label: 'Lagos', at: 66 }}
        caption="WHERE THE NEW BUILDERS ARE"
      />
      <Label name="map-zoom" />
    </Sequence>
    <Sequence from={SEG * 9} durationInFrames={SEG}>
      <GroundContext.Provider value="day">
        <AbsoluteFill style={{ background: COLORS.paper }} />
        <Checklist
          len={SEG}
          title="What you need"
          items={[
            { text: 'A laptop, not a phone', at: 8 },
            { text: 'Steady internet', at: 24 },
            { text: 'A free AI plan to start', at: 40 },
          ]}
        />
        <Label name="checklist on the day ground" />
      </GroundContext.Provider>
    </Sequence>
    <Sequence from={SEG * 10} durationInFrames={SEG}>
      <SplitScreen
        len={SEG}
        speakerSide="bottom"
        speaker={{ video: 'projects/akpos-segs-2/06-hold-mouth.mp4', focusY: 45 }}
        visual={{ img: `${DOC}/06-over-shoulder.jpg`, focusY: 62 }}
        seamCaption="Two live sessions"
      />
      <Label name="split-screen (kallaway)" />
    </Sequence>
    <Sequence from={SEG * 11} durationInFrames={SEG}>
      <Plate name="01-yaba-builder" dim={0.45} />
      <HookText len={SEG} overPicture words={[{ text: 'Who', at: 4 }, { text: 'builds', at: 10 }, { text: 'the', at: 16 }, { text: 'internet', at: 22, key: true }, { text: 'now?', at: 30 }]} />
      <Label name="hook-text" />
    </Sequence>
    <Sequence from={SEG * 12} durationInFrames={SEG}>
      <PunchZoom hits={[{ at: 24, to: 1.2, x: 600, y: 900 }, { at: 70, to: 1.15, x: 520, y: 760 }]}>
        <Plate name="02-lekki-banker" dim={0} />
      </PunchZoom>
      <Label name="punch-zoom" />
    </Sequence>
    <Sequence from={SEG * 13} durationInFrames={SEG}>
      <ChatThread len={SEG} title="Ada (customer)" msgs={[{ text: 'Good evening. Do you have a website?', at: 18, time: '9:41 PM' }, { text: 'I want to order before Friday', at: 46, time: '9:41 PM' }, { text: 'Yes, here is the link', me: true, at: 74, time: '9:42 PM' }]} />
      <Label name="chat-thread" />
    </Sequence>
    <Sequence from={SEG * 14} durationInFrames={SEG}>
      <Plate name="08-salon-owner" dim={0.35} />
      <Notifications len={SEG} notes={[{ app: 'Bookings', title: 'New booking', body: 'Braids, Saturday 11am', at: 10 }, { app: 'Payments', title: 'Payment received', body: 'Deposit for Saturday', at: 34, tone: 'gold' }, { app: 'Website', title: 'New enquiry', body: 'Do you do home service?', at: 58, tone: 'blue' }]} />
      <Label name="notifications" />
    </Sequence>
    <Sequence from={SEG * 15} durationInFrames={SEG}>
      <RankReveal len={SEG} title="What clients pay for first" items={[{ text: 'A site that brings enquiries', note: 'found on Google' }, { text: 'Online payments', note: 'naira, card or transfer' }, { text: 'A look of its own', note: 'not an AI template' }]} at={[10, 36, 64]} />
      <Label name="rank-reveal" />
    </Sequence>
    <Sequence from={SEG * 16} durationInFrames={SEG}>
      <Quiz len={SEG} question="How long until your first site is online?" options={['One week', 'One session', 'One month']} answer={1} timerFrom={20} revealAt={78} />
      <Label name="quiz" />
    </Sequence>
    <Sequence from={SEG * 17} durationInFrames={SEG}>
      <HighlightQuote len={SEG} parts={[{ text: 'AI can build almost anything. ' }, { text: 'It just needs someone who knows how to direct it.', mark: true }]} source="Build With AI course page, Qodeup" markAt={30} />
      <Label name="highlight-quote" />
    </Sequence>
    <Sequence from={SEG * 18} durationInFrames={SEG}>
      <Plate name="06-over-shoulder" dim={0} />
      <Annotate len={SEG} x={700} y={1150} rx={260} note="the plan goes in first" at={14} />
      <Label name="annotate" />
    </Sequence>
    <Sequence from={SEG * 19} durationInFrames={SEG}>
      <Plate name="03-ikeja-corps" dim={0.25} />
      <StepCounter overPicture label="steps" at={[0, 30, 60, 90]} />
      <Label name="step-counter" />
    </Sequence>
    <Sequence from={SEG * 20} durationInFrames={SEG}>
      <SharePrompt len={SEG} kind="send" line="Send this to the friend who keeps saying they will start next month" sub="Two live sessions, 13 and 14 November" />
      <Label name="share-prompt" />
    </Sequence>
    <Sequence from={SEG * 21} durationInFrames={SEG}>
      <Plate name="05-lagos-night" dim={0.4} />
      <Counter len={SEG} overPicture to={36} suffix="M+" label="developers joined GitHub in a year" source="GitHub Octoverse 2025" />
      <Label name="counter" />
    </Sequence>
    <Sequence from={SEG * 22} durationInFrames={SEG}>
      <Bars len={SEG} title="Fastest-growing skills, 2025 to 2030" bars={[{ label: 'AI and big data', value: 3, show: 'No. 1', hi: true }, { label: 'Networks and cybersecurity', value: 2, show: 'No. 2' }, { label: 'Technological literacy', value: 1, show: 'No. 3' }]} source="WEF Future of Jobs Report 2025 (ranks, not values)" />
      <Label name="bars" />
    </Sequence>
    <Sequence from={SEG * 23} durationInFrames={SEG}>
      <SearchBar len={SEG} query="bakery near me Yaba" results={[{ title: "Mama Tee's Bakery", sub: 'Order for collection, open before seven' }, { title: 'Fresh bread, Yaba', sub: 'Menu, prices, WhatsApp' }]} />
      <Label name="search-bar" />
    </Sequence>
    <Sequence from={SEG * 24} durationInFrames={SEG}>
      <Receipt len={SEG} title="BUILD WITH AI" lines={[{ item: 'Your website, online', at: 10 }, { item: 'Your own app, started', at: 20 }, { item: 'The Project Blueprint', at: 30 }, { item: 'Both recordings, 30 days', at: 40 }]} total={{ label: 'Class', value: '₦49,999', at: 56 }} />
      <Label name="receipt" />
    </Sequence>
    <Sequence from={SEG * 25} durationInFrames={SEG}>
      <BeforeAfter len={SEG} before={`${DOC}/03-ikeja-corps.jpg`} after={`${DOC}/01-yaba-builder.jpg`} beforeLabel="Day one" afterLabel="Session two" wipeFrom={20} wipeTo={70} />
      <Label name="before-after" />
    </Sequence>
    <Sequence from={SEG * 26} durationInFrames={SEG}>
      <Plate name="09-yaba-publish" dim={0} />
      <LowerThird len={SEG} name="Orezi Emeotu" role="Lead facilitator, Qodeup" />
      <Label name="lower-third" />
    </Sequence>
    <Sequence from={SEG * 27} durationInFrames={SEG}>
      <Sequence durationInFrames={60}><Plate name="04-surulere-designer" dim={0} /></Sequence>
      <Sequence from={60}><Plate name="07-yaba-bakery" dim={0} /></Sequence>
      <FlashCut at={60} />
      <Label name="flash-cut" />
    </Sequence>
  </AbsoluteFill>
  </GroundContext.Provider>
);

export default EffectsGallery;
