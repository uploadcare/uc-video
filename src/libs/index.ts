import videojs from "video.js";
import "video.js/dist/video-js.css";
import baseStyles from "./base.css?url";

import {
  allKeysConfiguration,
  arrayAttrKeys,
  attrKeyMapping,
  initialConfiguration,
  plainConfigKeys,
  toKebabCase,
} from "./configuration";
import plugins from "./plugins";
import type { VideoPlayer } from "./shared/schema/player";

for (const [name, plugin] of Object.entries(plugins)) {
  videojs.registerPlugin(name, plugin);
}

class BaseVideoComponent extends HTMLElement {
  static observedAttributes = arrayAttrKeys;
  protected _videoEl?: HTMLVideoElement;
  protected _player;

  protected _shadowRoot!: ShadowRoot;

  protected _options = Object.assign({}, initialConfiguration);

  protected _listeners = new Map();

  protected _initialized = false;
  protected _isReady = false;
  protected _videojsFontFaceInjected = false;

  constructor() {
    super();

    // this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.destroy();
    const anyThis = this as any;

    for (const key of allKeysConfiguration) {
      const initialValue = anyThis._options[key];

      if (initialValue !== initialConfiguration[key]) {
        this._setValue(key, initialValue);
      }

      if (!this.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          get: () => this._getValue(key),
          set: (value) => this._setValue(key, value),
        });
      }
    }

    for (const [event, handlers] of this._listeners) {
      handlers.forEach((cb: () => void) => this._player.on(event, cb));
    }

    this.render();
    // this.loadDependencies()
    //   .then(() => {
    //     this.render();
    //   })
    //   .catch((err) => {
    //     console.error("Failed to load dependencies:", err);
    //   });
  }

  disconnectedCallback() {
    this.destroy();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    const key = attrKeyMapping[name];
    this._setValue(key, newValue);
  }

  destroy() {
    this._listeners.clear();
    this._player?.dispose();
    this._player = null!;
    this._isReady = false;
    this._initialized = false;
    this._videoEl = null!;
    this.innerHTML = "";
    // this._shadowRoot.innerHTML = "";
  }

  render() {
    if (!this._videoEl) {
      this._createVideoElement();
      this._initVideoJS();
    }
  }

  loadDependencies(): Promise<void[]> {
    const styleURLs = [
      "https://cdn.jsdelivr.net/npm/@uploadcare/uc-video@latest/dist/uc-video.min.css",
      baseStyles,
    ];
    const promises = styleURLs.filter(Boolean).map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = url;
          link.onload = () => resolve();
          link.onerror = (e) => reject(e);
          this._shadowRoot.appendChild(link);
        })
    );

    this._injectGlobalFonts();

    return Promise.all(promises);
  }

  _injectGlobalFonts() {
    const FONT_FACE = `
    @font-face {
      font-family: 'VideoJS';
      src: url('https://vjs.zencdn.net/8.10.0/font/VideoJS.woff') format('woff'),
           url('https://vjs.zencdn.net/8.10.0/font/VideoJS.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

    if (!this._videojsFontFaceInjected) {
      const globalFont = document.createElement("style");
      globalFont.textContent = FONT_FACE;
      document.head.appendChild(globalFont);
      this._videojsFontFaceInjected = true;
    }
    return Promise.resolve();
  }

  _flushValueToAttribute(
    key: keyof typeof initialConfiguration,
    value: unknown
  ) {
    if (plainConfigKeys.includes(key)) {
      const attrs = [...new Set([toKebabCase(key), key.toLowerCase()])];
      for (const attr of attrs) {
        if (typeof value === "undefined" || value === null) {
          this.removeAttribute(attr as string);
        } else if (this.getAttribute(attr as string) !== value.toString()) {
          this.setAttribute(attr as string, value.toString());
        }
      }
    }
  }

  _flushValueToState(key: keyof typeof initialConfiguration, value: unknown) {
    if (this._options[key] !== value) {
      if (typeof value === "undefined" || value === null) {
        this._options[key] = initialConfiguration[key];
      } else {
        this._options[key] = value;
      }
    }
  }

  _normalizeConfigValue(
    key: keyof typeof initialConfiguration,
    value: unknown
  ) {
    if (typeof value === "undefined" || value === null) {
      return undefined;
    }

    try {
      if (typeof initialConfiguration[key] === "boolean") {
        if (typeof value === "undefined" || value === null) return false;
        if (typeof value === "boolean") return value;
        if (value === "true") return true;
        if (value === "") return true;
        if (value === "false") return false;
      } else if (typeof initialConfiguration[key] === "number") {
        if (typeof value === "string") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            return parsedValue;
          }
        }
      } else if (typeof initialConfiguration[key] === "string") {
        if (typeof value === "string") {
          return value;
        }
      } else if (typeof initialConfiguration[key] === "object") {
        if (typeof value === "object") {
          return value;
        }
      }
      return value;
    } catch (error) {
      console.error(`Error normalizing config value for key ${key}:`, error);
      return initialConfiguration[key];
    }
  }

  _setValue(key: keyof typeof initialConfiguration, value: unknown) {
    const anyThis = this;
    const normalizedValue = this._normalizeConfigValue(key, value);
    if (anyThis._options[key] === normalizedValue) return;

    anyThis._options[key] = normalizedValue;

    this._flushValueToAttribute(key, normalizedValue);
    this._flushValueToState(key, normalizedValue);

    this._player?.[key](normalizedValue);
  }

  _getValue(key: string) {
    const anyThis = this;
    return anyThis._options[key];
  }

  _createVideoElement() {
    const videoEl = document.createElement("video");
    videoEl.classList.add("video-js");
    this._videoEl = videoEl;
    this.appendChild(videoEl);
    // this._shadowRoot.appendChild(videoEl);
  }

  _initVideoJS() {
    if (!this._videoEl) {
      throw new Error("Video element already initialized.");
    }

    this._player = videojs(this._videoEl, this._options, () => {
      this._isReady = true;
    });
    this._initialized = true;
  }

  get player(): VideoPlayer {
    if (!this._player) {
      throw new Error("Video player is not initialized.");
    }
    return this._player;
  }

  get isReady(): boolean {
    return (
      this._isReady && this._initialized && this._player?.readyState() >= 1
    );
  }

  ready(callback?: () => void): Promise<void> | this {
    if (callback) {
      if (this.isReady) {
        callback();
      } else {
        this.player.ready(callback);
      }
      return this;
    }

    return new Promise((resolve) => {
      if (this.isReady) {
        resolve();
      } else {
        this.player.ready(() => {
          this._isReady = true;
          void resolve();
        });
      }
    });
  }

  on(event: string, callback: () => void) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);

    if (this._initialized) {
      this.player.on(event, callback);
    }
    return this;
  }

  off(event: string, callback: () => void) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).delete(callback);
    }
    if (this._initialized) {
      this.player.off(event, callback);
    }
    return this;
  }
}

export class VideoComponent extends BaseVideoComponent {
  _initVideoJS() {
    super._initVideoJS();
    this._initPlugins();
    this._calculateSrcUrl();
  }

  _initPlugins() {
    this._initQualityHls();
    this._initGeneratePoster();
    this._initLogo();
  }

  _initQualityHls() {
    this._player?.httpSourceSelector({ default: "auto" });
  }

  _calculateSrcUrl() {
    this._player?.UUIDSourceInstance({
      uuid: this._options.uuid,
      cdnCname: this._options.cdnCname,
    });
  }

  _initGeneratePoster() {
    this._player?.generatePoster({
      videoEl: this._videoEl,
      posterOffset: this._options?.posterOffset,
      crossOrigin: this._options?.crossorigin,
    });
  }

  _initLogo() {
    this._player?.LogoInstance({
      active: this._options?.showLogo,
    });
  }
}

export class UCVideo extends VideoComponent {}

if (!customElements.get("uc-video")) {
  customElements.define("uc-video", UCVideo);
}
