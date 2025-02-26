import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { BasePlugin } from "../BasePlugin";
import { VIDEO_PLAYER_EVENTS } from "../../shared/settings";
import './poster.css'
import { timeToSeconds } from "../../shared/utils/timeToSeconds";

const INIT_TIME = 0

const defaultOptions = {
  posterOffset: INIT_TIME
}
export class GeneratePoster extends BasePlugin {
  #videoEl: HTMLVideoElement | null = null;
  #posterOffset: string | number | undefined

  constructor(player: Player, options: {
    videoEl: HTMLVideoElement | null,
    posterOffset: string | number | undefined,
    crossOrigin: 'anonymous' | 'use-credentials' | undefined
  }) {
    super(player, options);

    this.#videoEl = options.videoEl as HTMLVideoElement;
    this.#posterOffset = options.posterOffset ? timeToSeconds(options.posterOffset as string) : defaultOptions.posterOffset;

    if (options.crossOrigin) {
      this.#videoEl.crossOrigin = options.crossOrigin;
    }


    this._player.on(VIDEO_PLAYER_EVENTS.READY, () => {
      this.#checkAndSetPoster();
    })
  }

  #checkAndSetPoster() {
    const existingPoster = this._player.poster();

    if (!existingPoster) {
      this._player.on(VIDEO_PLAYER_EVENTS.LOADED_METADATA, () => {
        this._player.currentTime(this.#posterOffset);
        this._player.on(VIDEO_PLAYER_EVENTS.SEEKED, () => {
          this.#captureFrameAndSetPoster();

          this._player.off(VIDEO_PLAYER_EVENTS.SEEKED)
        })
      })
    }
  }

  async #captureFrameAndSetPoster() {
    const duration = this._player.duration()

    // @ts-ignore
    if (this.#posterOffset > duration) {
      console.warn(
        `Capture time (${this.#posterOffset}s) exceeds video duration (${duration}s). Using last frame.`
      );
    }

    try {
      const frameURL = await this.#captureFrameAtTime();
      this._player.poster(frameURL as string); // Set the captured frame as the poster
    } catch (error) {
      console.error('Error setting poster:', error);
    }
  }

  #captureFrameAtTime() {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = this.#videoEl?.videoWidth || 0;
      canvas.height = this.#videoEl?.videoHeight || 0;


      if (!context) {
        reject('Failed to get canvas context');
        return;
      }

      try {
        context.drawImage(this.#videoEl as HTMLVideoElement, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } catch (error) {
        // @ts-ignore
        reject('Failed to capture frame: ' + error.message);
      } finally {
        this._player.currentTime(INIT_TIME);
      }
    })
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin("generatePoster", GeneratePoster);
