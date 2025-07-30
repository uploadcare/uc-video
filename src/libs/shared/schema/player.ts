import type Player from 'video.js/dist/types/player';

export type VideoPlayer = Player & {
  httpSourceSelector: (options: { default: 'auto' | 'low' | 'high' }) => void;
  generatePoster: (options: {
    videoEl: HTMLVideoElement | null;
    posterOffset?: string | number;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }) => void;
  addLogo: () => void;
};
