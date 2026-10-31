// Qodeup brand reference, night ground. Render a still at frame 45 to judge a brand change.
import React from 'react';
import { BrandSample } from '../../lib/brandSample';

export const compositionConfig = {
  id: 'BrandSampleNight',
  ground: 'night',
  durationInSeconds: 4,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BrandSampleNight: React.FC = () => <BrandSample ground="night" />;
export default BrandSampleNight;
