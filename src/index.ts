import videojs from 'video.js';

import videojsStyles from 'video.js/dist/video-js.css?inline';
import baseStyles from './base.css?inline';

import {
  allKeysConfiguration,
  arrayAttrKeys,
  attrKeyMapping,
  initialConfiguration,
  plainConfigKeys,
  type SubtitleTrack,
  toKebabCase,
  type VideoPlayerWithPlugins,
} from './configuration';
import plugins from './plugins';
import { VIDEO_PLAYER_EVENTS } from './shared/settings';
import { normalizeConfigValue } from './shared/utils/normalizeConfigValue';

for (const [name, plugin] of Object.entries(plugins)) {
  videojs.registerPlugin(name, plugin);
}

class BaseVideoComponent extends HTMLElement {
  static observedAttributes = arrayAttrKeys;
  protected _videoEl!: HTMLVideoElement | null;
  protected _player!: VideoPlayerWithPlugins;

  protected _shadowRoot!: ShadowRoot;
  protected _options = structuredClone(initialConfiguration);
  protected _listeners = new Map();

  protected _initialized = false;
  protected _isReady = false;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.destroy();

    // A value assigned before the element was upgraded is an own property that shadows the prototype accessor.
    for (const key of allKeysConfiguration) {
      if (Object.hasOwn(this, key)) {
        const value = this[key as keyof this];
        delete this[key as keyof this];
        this._setValue(key as keyof typeof initialConfiguration, value);
      }
    }

    this.render();

    this.loadDependencies().catch((err) => {
      console.error('Failed to load dependencies:', err);
    });
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
    this._isReady = false;
    this._initialized = false;

    //@ts-ignore
    this._player = null;
    this._videoEl = null;
    this._shadowRoot.innerHTML = '';
  }

  render() {
    if (!this._videoEl) {
      this._createVideoElement();
      this._loadStylesSync();
      this._initVideoJS();
    }
  }

  _loadStylesSync() {
    const style = document.createElement('style');
    style.textContent = videojsStyles + '\n' + baseStyles;
    this._shadowRoot.appendChild(style);
  }

  _loadBlobStyle(textContent: string): Promise<void> {
    return new Promise((resolve) => {
      const style = document.createElement('style');
      style.textContent = textContent;

      style.onload = () => resolve();
      style.onerror = () => resolve();

      this._shadowRoot.appendChild(style);
    });
  }

  async _loadFontFaceInHead(): Promise<void> {
    if (document.querySelector('style[data-videojs-font]')) {
      return Promise.resolve();
    }

    const fontUrl = (await import('./font/VideoJS.woff?url')).default;

    return new Promise((resolve) => {
      const style = document.createElement('style');
      style.setAttribute('data-videojs-font', 'true');
      style.textContent = `
        @font-face {
        font-family: 'VideoJS';
        src: url(${fontUrl}) format('woff');
        font-weight: normal;
        font-style: normal;
        }
      `;

      style.onload = () => resolve();
      style.onerror = () => resolve();

      document.head.appendChild(style);
    });
  }

  loadDependencies(): Promise<unknown[]> {
    const promises = Promise.all([this._loadFontFaceInHead()]);

    return Promise.resolve(promises);
  }

  _flushValueToAttribute(
    key: keyof typeof initialConfiguration,
    value: unknown,
  ) {
    if (plainConfigKeys.includes(key)) {
      const attrs = [...new Set([toKebabCase(key), key.toLowerCase()])];
      for (const attr of attrs) {
        if (typeof value === 'undefined' || value === null) {
          this.removeAttribute(attr as string);
        } else if (this.getAttribute(attr as string) !== value.toString()) {
          this.setAttribute(attr as string, value.toString());
        }
      }
    }
  }

  _flushValueToState(key: keyof typeof initialConfiguration, value: unknown) {
    if (this._options[key] !== value) {
      if (typeof value === 'undefined' || value === null) {
        //@ts-ignore
        this._options[key] = initialConfiguration[key];
      } else {
        //@ts-ignore
        this._options[key] = value;
      }
    }
  }

  _setValue(key: keyof typeof initialConfiguration, value: unknown) {
    const normalizedValue = normalizeConfigValue(key, value);
    if (this._options[key] === normalizedValue) return;

    //@ts-ignore
    this._options[key] = normalizedValue;

    this._flushValueToAttribute(key, normalizedValue);
    this._flushValueToState(key, normalizedValue);

    //@ts-ignore
    if (this._player?.[key]) {
      //@ts-ignore
      this._player?.[key](normalizedValue);
    }

    if ((key === 'width' || key === 'height') && this._player?.styleEl_) {
      this._shadowRoot.appendChild(this._player.styleEl_);
    }
  }

  _getValue(key: string) {
    return this._options[key as keyof typeof initialConfiguration];
  }

  _createVideoElement() {
    const videoEl = document.createElement('video');
    videoEl.classList.add('video-js');
    this._videoEl = videoEl;
    this._shadowRoot.appendChild(videoEl);
  }

  _initVideoJS() {
    if (!this._videoEl) {
      throw new Error('Video element already initialized.');
    }

    // The Subtitles plugin owns all text tracks. If video.js saw `tracks` it would add them itself, and they couldn't be replaced later.
    const options = { ...this._options, tracks: [] };

    this._player = videojs(this._videoEl, options, () => {
      this._isReady = true;

      this._shadowRoot.appendChild(this._player.styleEl_);
    }) as VideoPlayerWithPlugins;

    this._initialized = true;

    this._attachQueuedListeners();
  }

  _attachQueuedListeners() {
    if (!this._initialized || !this._player) return;

    for (const [event, handlers] of this._listeners) {
      handlers.forEach((cb: () => void) => this._player.on(event, cb));
    }
  }

  get player() {
    return this._player;
  }

  get isReady(): boolean {
    return this._isReady && this._initialized && this._player.readyState() >= 1;
  }

  ready(callback?: () => void): Promise<void> | this {
    if (callback) {
      if (this.isReady) {
        callback();
      } else {
        this.on(VIDEO_PLAYER_EVENTS.READY, callback);
      }
      return this;
    }

    return new Promise((resolve) => {
      if (this.isReady) {
        resolve();
      } else {
        this.on(VIDEO_PLAYER_EVENTS.READY, () => {
          this._isReady = true;
          resolve();
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

// Defined on the prototype so `key in el` holds before connect; React and Vue check that to set a property instead of an attribute.
for (const key of allKeysConfiguration) {
  Object.defineProperty(BaseVideoComponent.prototype, key, {
    configurable: true,
    enumerable: true,
    get(this: BaseVideoComponent) {
      return this._getValue(key);
    },
    set(this: BaseVideoComponent, value: unknown) {
      this._setValue(key as keyof typeof initialConfiguration, value);
    },
  });
}

export class VideoComponent extends BaseVideoComponent {
  protected _tracksObserver: MutationObserver | null = null;

  destroy() {
    this._tracksObserver?.disconnect();
    this._tracksObserver = null;
    super.destroy();
  }

  _setValue(key: keyof typeof initialConfiguration, value: unknown) {
    super._setValue(key, value);

    if (key === 'tracks') {
      this._syncTracks();
    }
  }

  _initVideoJS() {
    super._initVideoJS();
    this._initPlugins();
    this._calculateSrcUrl();
  }

  _initPlugins() {
    this._initQualityHls();
    this._initGeneratePoster();
    this._initLogo();
    this._initSubtitles();
  }

  _initSubtitles() {
    this._player?.SubtitlesInstance({
      crossOrigin: this._options?.crossorigin,
    });

    this._player
      ?.getChild('textTrackDisplay')
      ?.el()
      .setAttribute('part', 'subtitles');

    // <track> children stay in the light DOM, out of reach of the <video> inside the shadow root.
    this._tracksObserver = new MutationObserver(() => this._syncTracks());
    this._tracksObserver.observe(this, {
      childList: true,
      subtree: true,
      attributeFilter: ['src', 'kind', 'srclang', 'label', 'default'],
    });

    this._syncTracks();
  }

  _syncTracks() {
    const childTracks = Array.from(
      this.querySelectorAll<HTMLTrackElement>(':scope > track'),
      (el): SubtitleTrack => ({
        src: el.src,
        kind: el.kind as SubtitleTrack['kind'],
        srclang: el.srclang,
        label: el.label,
        default: el.default,
      }),
    );

    const tracks = Array.isArray(this._options.tracks)
      ? this._options.tracks
      : [];

    this._player
      ?.SubtitlesInstance()
      .setTracks([...childTracks, ...tracks].filter((track) => track?.src));
  }

  _initQualityHls() {
    this._player?.httpSourceSelector();
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

if (!customElements.get('uc-video')) {
  customElements.define('uc-video', UCVideo);
}
