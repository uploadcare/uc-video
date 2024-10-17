import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

import plugins from "./plugins";
import {
  COMMON_OPTIONS,
  SOURCES_MIME_TYPES,
  type TProps,
} from "./shared/settings";
import { mergeOptions } from "./shared/utils/mergeOptions";
import { createSrcVideoAdaptive } from "./shared/url/createSrcVideoAdaptive";

for (const [name, plugin] of Object.entries(plugins)) {
  videojs.registerPlugin(name, plugin);
}

export class UCVideo extends HTMLElement {
  #player: Player | null = null;
  #options?: TProps = COMMON_OPTIONS;
  #videoEl: HTMLVideoElement | null = null;

  connectedCallback() {
    this.#options = mergeOptions(
      this.attributes,
      COMMON_OPTIONS
    )

    this.#renderElVideo().then((videoEl) => this.#initPlayer(videoEl));
  }

  disconnectedCallback() {
    if (this.#player) {
      this.#player.dispose();
      this.innerHTML = "";
    }
  }

  #initPlayer(videoEl: HTMLVideoElement) {
    if (!this.#player && videoEl) {
      this.#player = videojs(videoEl, this.#options);

      this.#calcSrc();

      this.#listenerErrors();
      this.#initPlugins();
    }
  }

  #renderElVideo() {
    return new Promise<HTMLVideoElement>((resolve) => {
      this.#videoEl = document.createElement("video");
      this.#videoEl.classList.add("video-js");

      this.appendChild(this.#videoEl);
      resolve(this.#videoEl);
    });
  }

  #initPlugins() {
    this.#initQualityHls();
    this.#initGeneratePoster();
    this.#initLogo()
  }

  #initQualityHls() {
    this.#player?.httpSourceSelector({ default: "auto" });
  }

  #initGeneratePoster() {
    this.#player?.generatePoster({
      videoEl: this.#videoEl,
      offset: this.#options?.["data-offset"],
    });
  }

  #initLogo() {
    if (!this.#options?.showLogo) return

    this.#player?.addLogo()
  }

  #listenerErrors() { }

  #calcSrc() {
    const src = this.#options?.src ? this.#options?.src : this.#options.uuid ? createSrcVideoAdaptive(this.#options?.cdnCname, this.#options?.uuid) : false

    if (!src) {
      this.#player?.error('Please provide a valid uuid or src to ensure proper video delivery.')
      throw new Error('Please provide a valid uuid or src to ensure proper video delivery.')
    }


    this.#player?.src({
      src,
      type: SOURCES_MIME_TYPES.hls
    });
  }
}

customElements.define("uc-video", UCVideo);
