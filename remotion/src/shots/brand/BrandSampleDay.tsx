// Qodeup brand reference, day ground. Render a still at frame 45 to judge a brand change.
import React from 'react';
import { BrandSample } from '../../lib/brandSample';

export const compositionConfig = {
  id: 'BrandSampleDay',
  durationInSeconds: 4,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BrandSampleDay: React.FC = () => <BrandSample ground="day" />;
export default BrandSampleDay;
