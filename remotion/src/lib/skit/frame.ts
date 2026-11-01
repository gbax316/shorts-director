import { createContext, useContext } from 'react';
import { useCurrentFrame } from 'remotion';

/**
 * Frames a scene starts early to overlap the scene before it (a push or a reveal). Scenes read
 * their frame through useF(), so local frame 0 is still the scene's own start and every cue
 * stays where the timeline puts it; the lead frames are negative.
 */
export const LeadCtx = createContext(0);

export const useF = () => useCurrentFrame() - useContext(LeadCtx);
