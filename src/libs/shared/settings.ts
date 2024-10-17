import videojs from "video.js";

export const DEFAULT_CDN_CNAME = "https://ucarecdn.com";

export const DEFAULT_HLS_OPTIONS = {
  html5: {
    handlePartialData: false,

    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,

    vhs: {
      overrideNative: videojs && videojs.browser ? !videojs.browser.IS_IOS && !videojs.browser.IS_SAFARI : true,
    },
  },
};

export const COMMON_OPTIONS: TProps = {
  __namespace: "uc-video",

  controls: true,
  fluid: true,
  loop: false,
  muted: false,
  poster: "",
  preload: "auto",
  src: "",
  uuid: "",
  // crossorigin: "anonymous",
  playbackRates: [],

  cdnCname: DEFAULT_CDN_CNAME,
  showLogo: true,

  'data-offset': undefined,

  ...DEFAULT_HLS_OPTIONS
};

export const SOURCES_MIME_TYPES = {
  hls: "application/x-mpegURL", // application/vnd.apple.mpegurl
};

export type TProps = {
  __namespace?: "uc-video";

  controls?: boolean;
  height?: string | number;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  preload?: "auto" | "metadata" | "none";
  width?: string | number;
  fluid?: boolean;

  src?: string;
  uuid?: string;
  crossorigin?: string
  playbackRates?: string[]

  cdnCname?: string;
  showLogo?: boolean

  'data-offset'?: number
};

export enum VIDEO_PLAYER_EVENTS {
  READY = "ready",
  PLAY = "play",
  PLAYING = "playing",
  PAUSE = "pause",
  SEEK = "seek",
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


export type TOptions = Record<string, unknown>