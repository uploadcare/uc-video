import videojs from 'video.js';
import type {
  SubtitleTrack,
  VideoAttributes,
  VideoPlayerWithPlugins,
} from '../../configuration';
import { toWebVTT } from './toWebVTT';

const Plugin = videojs.getPlugin('plugin');

type Options = {
  crossOrigin?: VideoAttributes['crossorigin'];
};

type OwnedTrack = {
  trackEl: ReturnType<VideoPlayerWithPlugins['addRemoteTextTrack']>;
  url: string;
};

//@ts-ignore
export class Subtitles extends Plugin {
  private player: VideoPlayerWithPlugins;
  private crossOrigin: Options['crossOrigin'];
  private owned: OwnedTrack[] = [];
  private requested = '[]';
  private generation = 0;

  constructor(player: VideoPlayerWithPlugins, options: Options = {}) {
    super(player, options);

    this.player = player;
    this.crossOrigin = options.crossOrigin;
  }

  async setTracks(tracks: SubtitleTrack[]) {
    const requested = JSON.stringify(tracks);
    if (requested === this.requested) return;

    this.requested = requested;
    const generation = ++this.generation;

    const urls = await Promise.all(tracks.map((track) => this.load(track)));

    if (generation !== this.generation) {
      for (const url of urls) {
        if (url) URL.revokeObjectURL(url);
      }
      return;
    }

    this.removeOwned();

    tracks.forEach((track, index) => {
      const url = urls[index];
      if (!url) return;

      // Manual cleanup, otherwise video.js drops the track on every player.src() call (e.g. a uuid change).
      const trackEl = this.player.addRemoteTextTrack(
        { ...track, src: url },
        true,
      );

      this.owned.push({ trackEl, url });
    });

    // biome-ignore lint/suspicious/noExplicitAny: preselectTrack is missing from video.js typings
    (this.player.getChild('textTrackDisplay') as any)?.preselectTrack();
  }

  dispose() {
    this.generation++;
    this.removeOwned();
    //@ts-ignore
    super.dispose();
  }

  private removeOwned() {
    for (const { trackEl, url } of this.owned) {
      this.player.removeRemoteTextTrack(trackEl);
      URL.revokeObjectURL(url);
    }
    this.owned = [];
  }

  // Tracks are fetched here rather than by video.js so SRT can be detected by content: CDN URLs have no file extension.
  private async load(track: SubtitleTrack) {
    try {
      const response = await fetch(track.src, {
        credentials:
          this.crossOrigin === 'use-credentials' ? 'include' : 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const vtt = toWebVTT(await response.text());

      if (!vtt.includes('-->')) {
        throw new Error('Not a WebVTT or SRT file');
      }

      return URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
    } catch (error) {
      console.error(`Failed to load subtitles from ${track.src}:`, error);
      return null;
    }
  }
}

videojs.registerPlugin('SubtitlesInstance', Subtitles);
