import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

import plugins from "./plugins";

import {
  __LIST_ATTRIBUTES,
  DEFAULT_CDN_CNAME,
  DEFAULT_HLS_OPTIONS,
  SOURCES_MIME_TYPES,
} from "./shared/settings";

import { mergeOptions } from "./shared/utils/mergeOptions";
import { createSrcVideoAdaptive } from "./shared/url/createSrcVideoAdaptive";
import type { Options } from "./shared/schema";
import { getMimeType } from "./shared/url/getMimeType";

for (const [name, plugin] of Object.entries(plugins)) {
  videojs.registerPlugin(name, plugin);
}

export class UCVideo extends HTMLElement {
  #player: Player & {
    httpSourceSelector: (options: { default: "auto" | "low" | "high" }) => void;
    generatePoster: (options: { videoEl: HTMLVideoElement, posterOffset: string | number, crossOrigin?: 'anonymous' | 'use-credentials' }) => void;
    addLogo: () => void;
  } | null = null;
  #options?: Options;
  #videoEl: HTMLVideoElement | null = null;

  static get observedAttributes() {
    return Object.keys(__LIST_ATTRIBUTES);
  }

  connectedCallback() {
    this.#options = videojs.obj.merge(mergeOptions(this.attributes, __LIST_ATTRIBUTES), DEFAULT_HLS_OPTIONS)

    this.#renderElVideo().then((videoEl) => this.#initPlayer(videoEl));
  }

  disconnectedCallback() {
    if (this.#player) {
      this.#player.dispose();
      this.innerHTML = "";
    }
  }

  attributeChangedCallback() {
    // Called when observed attributes change
    // console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
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
    this.#initLogo();
  }

  #initQualityHls() {
    this.#player?.httpSourceSelector({ default: "auto" });
  }

  #initGeneratePoster() {
    this.#player?.generatePoster({
      videoEl: this.#videoEl,
      posterposterOffset: this.#options?.posterOffset,
      crossOrigin: this.#options?.crossorigin
    });
  }

  #initLogo() {
    if (!this.#options?.showLogo) return;

    this.#player?.addLogo();
  }

  #listenerErrors() { }


  /* Function to get mime type from a request */
  async #getVideoSources(src) {
    return await getMimeType(src);
  }

  #calcSrc() {
    if (!this.#options?.uuid) {
      throw new Error("Add a uuid");
    }

    const src = createSrcVideoAdaptive(
      this.#options?.cdnCname || DEFAULT_CDN_CNAME,
      this.#options?.uuid,
    );

    this.#player?.src({
      src,
      type: SOURCES_MIME_TYPES.hls
    });
  }
}

customElements.define("uc-video", UCVideo);
