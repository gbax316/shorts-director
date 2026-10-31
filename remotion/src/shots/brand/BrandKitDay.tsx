// Kit check: every shorts-kit component with NO colour props, on the day ground, so the kit's
// own defaults are what you see. Render a still at frame 78 after any brand or kit change.
import React from 'react';
import { BigTitle, Captions, Kicker, PauseCard, ProgressBar, ShortsBackdrop, Stamp, StatChip, VoLine } from '../../lib/shorts';

export const compositionConfig = {
  id: 'BrandKitDay',
  ground: 'day',
  durationInSeconds: 4,
  fps: 30,
  width: 1080,
  height: 1920,
};

const VO: VoLine[] = [{
  text: 'Your team types every order twice.', start: 2.2, end: 3.6,
  words: [
    { w: 'Your', start: 2.2, end: 2.4 }, { w: 'team', start: 2.4, end: 2.6 }, { w: 'types', start: 2.6, end: 2.9 },
    { w: 'every', start: 2.9, end: 3.1 }, { w: 'order', start: 3.1, end: 3.35 }, { w: 'twice.', start: 3.35, end: 3.6 },
  ],
}];

const BrandKitDay: React.FC = () => (
  <>
    <ShortsBackdrop />
    <ProgressBar />
    <Kicker text="THE COST" y={150} />
    <BigTitle lines={[{ text: 'Same order.' }, { text: 'Typed twice.' }]} subtitle="WhatsApp, then the spreadsheet" y={270} />
    <StatChip label="Per order" value="4 minutes by hand" x={90} y={640} w={420} />
    <StatChip label="Per week" value="11 hours gone" x={570} y={640} w={420} />
    <Stamp text="WASTED" y={930} />
    <PauseCard title="PAUSE" subtitle="how many do you type?" durSec={4} y={1180} />
    <Captions lines={VO} y={1500} />
  </>
);
export default BrandKitDay;
