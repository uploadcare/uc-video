import { type OptionRecord, Preload, type Options } from "./schema";
import {
  asArrayNumber,
  asBoolean,
  asNumber,
  asString,
} from "./utils/validators";

export const DEFAULT_CDN_CNAME = "https://ucarecdn.com";

export const DEFAULT_HLS_OPTIONS = {
  html5: {
    handlePartialData: false,

    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,

    vhs: {
      overrideNative: true,
    },
  },
};

export const LIST_ATTRIBUTES: OptionRecord<Options> = {
  controls: {
    validator: asBoolean,
    value: false,
  },
  height: {
    validator: asNumber,
    value: "",
  },
  loop: {
    validator: asBoolean,
    value: false,
  },
  muted: {
    validator: asBoolean,
    value: false,
  },
  poster: {
    validator: asString,
    value: "",
  },
  preload: {
    validator: asString,
    value: Preload.AUTO,
  },
  width: {
    validator: asString,
    value: "",
  },
  uuid: {
    validator: asString,
    value: "",
  },
  autoplay: {
    validator: asBoolean,
    value: false,
  },
  posterOffset: {
    validator: asString,
    value: "",
  },
  showLogo: {
    validator: asBoolean,
    value: true,
  },
  fluid: {
    validator: asBoolean,
    value: false,
  },
  playbackRates: {
    validator: asArrayNumber,
    value: undefined
  },
  cdnCname: {
    validator: asString,
    value: DEFAULT_CDN_CNAME,
  },
  crossorigin: {
    validator: asString,
    value: undefined,
  },
  playsinline: {
    validator: asBoolean,
    value: false,
  }
};

export const SOURCES_MIME_TYPES = {
  hls: "application/x-mpegURL",
  hlsFromContentType: "application/vnd.apple.mpegurl",
  mp4: "video/mp4",
};

export enum VIDEO_PLAYER_EVENTS {
  READY = "ready",
  PLAY = "play",
  PLAYING = "playing",
  PAUSE = "pause",
  SEEK = "seek",
  SEEKED = "seeked",
  SEEKING = "seeking",
  MUTE = "mute",
  UNMUTE = "unmute",
  PAUSE_NO_SEEK = "pausenoseek",
  ERROR = "error",
  TIME_UPDATE = "timeupdate",
  EMPTIED = "emptied",
  RETRY_PLAYLIST = "retryplaylist",
  CAN_PLAY_THROUGH = "canplaythrough",
  CLD_SOURCE_CHANGED = "cldsourcechanged",
  SOURCE_CHANGED = "sourcechanged",
  LOADED_METADATA = "loadedmetadata",
  LOADED_DATA = "loadeddata",
  REFRESH_TEXT_TRACKS = "refreshTextTracks",
  PLAYLIST_CREATED = "playlistcreated",
  UP_COMING_VIDEO_SHOW = "upcomingvideoshow",
  UP_COMING_VIDEO_HIDE = "upcomingvideohide",
  PLAYLIST_ITEM_CHANGED = "playlistitemchanged",
  VOLUME_CHANGE = "volumechange",
  FLUID = "fluid",
  PLAYLIST_PANEL = "PlaylistPanel",
  ENDED = "ended",
  RESIZE = "resize",
  START = "start",
  VIDEO_LOAD = "videoload",
  PRODUCT_BAR_MIN = "productBarMin",
  SHOW_PRODUCTS_OVERLAY = "showProductsOverlay",
  SHOPPABLE_ITEM_CHANGED = "shoppableitemchanged",
  FULL_SCREEN_CHANGE = "fullscreenchange",
  PERCENTS_PLAYED = "percentsplayed",
  TIME_PLAYED = "timeplayed",
  PLAYER_LOAD = "playerload",
  DISPOSE = "dispose",
  QUALITY_CHANGED = "qualitychanged",
}

export type TOptions = Record<string, unknown>;
