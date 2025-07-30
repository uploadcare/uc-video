import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './base.css';
import {
  allKeysConfiguration,
  arrayAttrKeys,
  attrKeyMapping,
  initConfiguration,
} from './configuration';
import plugins from './plugins';
import type { VideoPlayer } from './shared/schema/player';
import { SOURCES_MIME_TYPES } from './shared/settings';
import { createSrcVideoAdaptive } from './shared/url/createSrcVideoAdaptive';

for (const [name, plugin] of Object.entries(plugins)) {
  videojs.registerPlugin(name, plugin);
}

class BaseVideoComponent extends HTMLElement {
  static observedAttributes = arrayAttrKeys;
  protected _videoEl?: HTMLVideoElement;
  protected _player: any;
  protected _options = videojs.obj.merge(initConfiguration);

  connectedCallback() {
    this.destroy();

    for (const key of allKeysConfiguration) {
      Object.defineProperty(this, key, {
        get: () => this._getValue(key),
        set: (value) => this._setValue(key, value),
      });
    }

    this.render();
  }

  disconnectedCallback() {
    this.destroy();
  }

  connectedMoveCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    const key = attrKeyMapping[name];
    this._options[key] = newValue;
  }

  _setValue(key: string, value: unknown) {
    try {
      if (this._options[key] === value) return;

      this._options[key] = value;

      if (this._player[key]) {
        this._player[key](value);
      }
    } catch (error) {
      console.error(`The value for ${key} is not supported:`, error);
    }
  }

  _getValue(key: string) {
    return this._options[key];
  }

  _createVideoElement() {
    const videoEl = document.createElement('video');
    videoEl.classList.add('video-js');
    this._videoEl = videoEl;
    this.appendChild(videoEl);
  }

  render() {
    this._createVideoElement();
    this._initVideoJS();
  }

  destroy() {
    this._player?.dispose();
    this._player = null;
    this.innerHTML = '';
  }

  _initVideoJS() {
    if (!this._videoEl) {
      throw new Error('Video element already initialized.');
    }

    this._player = videojs(this._videoEl, this._options);
  }

  get player(): VideoPlayer {
    if (!this._player) {
      throw new Error('Video player is not initialized.');
    }
    return this._player;
  }
}

export class VideoComponent extends BaseVideoComponent {
  constructor() {
    super();
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
  }

  _initQualityHls() {
    this._player?.httpSourceSelector({ default: 'auto' });
  }

  _calculateSrcUrl() {
    if (!this._options.uuid) {
      throw new Error('UUID is required to calculate the video source URL.');
    }

    this._player?.src({
      src: createSrcVideoAdaptive(this._options?.cdnCname, this._options?.uuid),
      type: SOURCES_MIME_TYPES.hls,
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
    if (!this._options?.showLogo) return;

    this._player?.showLogo();
  }
}

export class UCVideo extends VideoComponent {}

if (!customElements.get('uc-video')) {
  customElements.define('uc-video', UCVideo);
}
