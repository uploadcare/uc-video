import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { BasePlugin } from "../BasePlugin";
import { VIDEO_PLAYER_EVENTS, type TOptions } from "../../shared/settings";

export class GeneratePoster extends BasePlugin {
  #videoEl: HTMLVideoElement | null = null;
  #offset: string | number | null = null;
  #poster: string | undefined = "";

  constructor(player: Player, options: TOptions) {
    super(player, options);

    this.#videoEl = options.videoEl;
    this.#offset = options.offset || 2;

    this.#poster = this?._player?.poster();

    this.on(this._player, VIDEO_PLAYER_EVENTS.LOADED_METADATA, () => {
      if (!this.#poster) {

        if (this.#offset > this._player.duration()) {
          throw Error(`The provided offset value ${this.#offset} exceeds the total duration: ${this._player.duration()}. Please adjust the offset to be less than or equal to the duration.`)
        }

        this._player.currentTime(this.#offset);
        this._player.on("seeked", () => {
          this.#createPosterFromTimecode();

          this._player.off("seeked");
        });
      }
    });
  }

  #createPosterFromTimecode() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = this.#videoEl.videoWidth;
    canvas.height = this.#videoEl.videoHeight;

    context?.drawImage(this.#videoEl, 0, 0, canvas.width, canvas.height);

    try {
      const posterDataUrl = canvas.toDataURL("image/png");

      this._player.poster(posterDataUrl);
    } catch (error) {
      console.log(error);
    }

    this._player.currentTime(0);
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin("generatePoster", GeneratePoster);
