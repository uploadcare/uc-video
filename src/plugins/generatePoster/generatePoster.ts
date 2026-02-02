import videojs from 'video.js';

import { VIDEO_PLAYER_EVENTS } from '../../shared/settings';
import './poster.css';
import type { VideoPlayerWithPlugins } from '../../configuration';
import { timeToSeconds } from '../../shared/utils/timeToSeconds';

const INIT_TIME = 0;

const defaultOptions = {
  posterOffset: INIT_TIME,
};

const Plugin = videojs.getPlugin('plugin');

type Player = VideoPlayerWithPlugins & {
  posterOffset: () => void;
};

//@ts-ignore
export class GeneratePoster extends Plugin {
  private player: Player;
  private _videoEl: HTMLVideoElement | null = null;
  private _posterOffset: string | number | undefined;

  constructor(
    player: Player,
    options: {
      videoEl: HTMLVideoElement | null;
      posterOffset: string | number | undefined;
      crossOrigin: 'anonymous' | 'use-credentials' | undefined;
    },
  ) {
    super(player, options);

    this.player = player;

    this._videoEl = options.videoEl as HTMLVideoElement;
    this._posterOffset = options.posterOffset
      ? timeToSeconds(options.posterOffset as string)
      : defaultOptions.posterOffset;

    if (options.crossOrigin) {
      this._videoEl.crossOrigin = options.crossOrigin;
    }

    this.player.posterOffset = () => this._checkAndSetPoster();

    this.player.on(VIDEO_PLAYER_EVENTS.READY, () => {
      this._checkAndSetPoster();
    });
  }

  _checkAndSetPoster() {
    const existingPoster = this.player.poster();

    if (!existingPoster) {
      this.player.on(VIDEO_PLAYER_EVENTS.LOADED_METADATA, () => {
        this.player.currentTime(this._posterOffset);
        this.player.on(VIDEO_PLAYER_EVENTS.SEEKED, () => {
          this._captureFrameAndSetPoster();

          this.player.off(VIDEO_PLAYER_EVENTS.SEEKED);
        });
      });
    }
  }

  async _captureFrameAndSetPoster() {
    const duration = this.player.duration();

    // @ts-ignore
    if (this._posterOffset > duration) {
      console.warn(
        `Capture time (${this._posterOffset}s) exceeds video duration (${duration}s). Using last frame.`,
      );
    }
    try {
      const frameURL = await this._captureFrameAtTime();
      this.player.poster(frameURL as string); // Set the captured frame as the poster
    } catch (error) {
      console.error('Error setting poster:', error);
    }
  }

  _captureFrameAtTime() {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = this._videoEl?.videoWidth || 0;
      canvas.height = this._videoEl?.videoHeight || 0;

      if (!context) {
        reject('Failed to get canvas context');
        return;
      }

      try {
        context.drawImage(
          this._videoEl as HTMLVideoElement,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } catch (error) {
        // @ts-ignore
        reject('Failed to capture frame: ' + error.message);
      } finally {
        this.player.currentTime(INIT_TIME);
      }
    });
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin('generatePoster', GeneratePoster);
